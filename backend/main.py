from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kerykeion import AstrologicalSubject, Report
import httpx
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BirthData(BaseModel):
    name: str
    year: int
    month: int
    day: int
    hour: int
    minute: int
    city: str
    nation: str

async def get_coordinates(city: str, nation: str):
    url = f"https://nominatim.openstreetmap.org/search?q={city},{nation}&format=json&limit=1"
    headers = {"User-Agent": "AstroCelestialApp/1.0"}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        data = response.json()
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
        raise ValueError("Could not find coordinates for this location.")

@app.post("/api/analyze")
async def analyze_birth_chart(data: BirthData):
    try:
        # 1. Geocoding
        lat, lon = await get_coordinates(data.city, data.nation)
        
        # 2. Astrological Calculation (Local & Free via Swiss Ephemeris)
        subject = AstrologicalSubject(
            name=data.name,
            year=data.year,
            month=data.month,
            day=data.day,
            hour=data.hour,
            minute=data.minute,
            city=data.city,
            nation=data.nation,
            lat=lat,
            lng=lon,
            tz_str="auto"
        )
        
        report = Report(subject)
        
        # Extract data for frontend
        sun = subject.sun
        moon = subject.moon
        asc = subject.first_house
        
        # Count elements (Fire, Earth, Air, Water)
        elements = {"Fire": 0, "Earth": 0, "Air": 0, "Water": 0}
        for p in [subject.sun, subject.moon, subject.mercury, subject.venus, subject.mars, subject.jupiter, subject.saturn]:
            elements[p.element] += 1
            
        total_planets = sum(elements.values())
        element_percentages = {k: round((v/total_planets)*100) for k, v in elements.items()}
        
        # Extract planetary degrees for drawing the SVG chart
        planets_data = [
            {"name": "Güneş", "sign": sun.sign, "degree": sun.abs_pos},
            {"name": "Ay", "sign": moon.sign, "degree": moon.abs_pos},
            {"name": "Merkür", "sign": subject.mercury.sign, "degree": subject.mercury.abs_pos},
            {"name": "Venüs", "sign": subject.venus.sign, "degree": subject.venus.abs_pos},
            {"name": "Mars", "sign": subject.mars.sign, "degree": subject.mars.abs_pos},
            {"name": "Jüpiter", "sign": subject.jupiter.sign, "degree": subject.jupiter.abs_pos},
            {"name": "Satürn", "sign": subject.saturn.sign, "degree": subject.saturn.abs_pos},
        ]
        
        # 3. AI Analysis (Prompt Engineering)
        analysis_text = ""
        if model:
            prompt = f"""
            Sen profesyonel, modern ve analitik bir astrologsun.
            Şu kişi için derinlikli bir astrolojik profil çıkar:
            İsim: {data.name}
            Güneş: {sun.sign}
            Ay: {moon.sign}
            Yükselen: {asc.sign}
            Baskın Element Oranları: Ateş %{element_percentages['Fire']}, Toprak %{element_percentages['Earth']}, Hava %{element_percentages['Air']}, Su %{element_percentages['Water']}
            
            Lütfen mistik dilden ziyade psikolojik derinliğe, kariyer/finans yaklaşımına ve potansiyellerine odaklanan, şık ve okunabilir 3 paragraflık bir Türkçe analiz yaz. Paragrafların arasına boşluk bırak. Markdown kullanma, sadece saf ve edebi bir metin olsun.
            """
            response = model.generate_content(prompt)
            analysis_text = response.text
        else:
            analysis_text = f"Yapay zeka analizi için backend'e GEMINI_API_KEY eklenmelidir. \n\nSizin verileriniz:\nGüneş: {sun.sign}\nAy: {moon.sign}\nYükselen: {asc.sign}"

        return {
            "status": "success",
            "summary": {
                "sun": sun.sign,
                "moon": moon.sign,
                "ascendant": asc.sign,
                "dominant_element": max(elements, key=elements.get)
            },
            "elements": element_percentages,
            "planets": planets_data,
            "analysis": analysis_text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
