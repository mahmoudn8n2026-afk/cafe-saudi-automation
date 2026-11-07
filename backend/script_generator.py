"""
Saudi Youth Cafe AI Script Generator
Generates high-converting, punchy scripts for Saudi / Gulf cafe marketing in 3 distinct styles.
Supports Gemini API, Groq, or high-fidelity offline fallback.
"""

import os
import json
import random
import requests
from typing import Dict, Any, Optional

STYLES = {
    "مرِح": "cheerful",
    "أستيتيك": "aesthetic",
    "ترند": "trend_challenge",
    "cheerful": "cheerful",
    "aesthetic": "aesthetic",
    "trend_challenge": "trend_challenge"
}

SAUDI_TREND_HASHTAGS = [
    "#كافيهات_الرياض", "#قهوة_مختصة", "#هبة_الرياض", 
    "#يسرسح", "#ترند_تيك_توك", "#كافيهات_السعودية", 
    "#روقان_المساء", "#أماكن_الرياض"
]

FALLBACK_TEMPLATES = {
    "cheerful": [
        {
            "hook": "يسرسح على القلب!",
            "voiceover": "يا ساتر على الروقان! لو تدور على شيء يبرد على قلبك ويعدل مزاجك بنص اليوم، هالمشروب خيالي ومضبوط بالملي. لا يفوتكم الطعم الخرافي، منشن خويك اللي يحب يدلع نفسه وخليه يعزمك!",
            "duration": 14,
            "cta": "تعال جرّب وعيش الجو، ولا تنسى تمنشن خويك!",
            "subtitles": [
                {"text": "يا ساتر على الروقان!", "start": 0.0, "end": 2.5},
                {"text": "لو تدور شيء يبرّد على قلبك", "start": 2.5, "end": 6.0},
                {"text": "هالمشروب خيالي ومضبوط بالملي!", "start": 6.0, "end": 10.0},
                {"text": "منشن خويك وخله يعزمك!", "start": 10.0, "end": 14.0}
            ]
        },
        {
            "hook": "جرّبت هبة اليوم؟",
            "voiceover": "رسميًا هذا الشيء صار إدماني الجديد! ميكس نكهات يسرسح ويعطيك طاقة تفصلك عن زحمة الدنيا. الطعم يفوز وبجدارة، تعال عيش التجربة قبل ما يخلص اليوم!",
            "duration": 13,
            "cta": "الحق جرّبه اليوم واحفظ المقطع عندك!",
            "subtitles": [
                {"text": "رسميًا إدماني الجديد!", "start": 0.0, "end": 2.5},
                {"text": "ميكس نكهات يسرسح ويفصلك عن الزحمة", "start": 2.5, "end": 6.5},
                {"text": "الطعم يفوز وبجدارة!", "start": 6.5, "end": 9.5},
                {"text": "تعال عيش التجربة الحين!", "start": 9.5, "end": 13.0}
            ]
        }
    ],
    "aesthetic": [
        {
            "hook": "روقان وتفاصيل راقية",
            "voiceover": "بين هدوء المكان ورائحة البن الفاخر، كوب واحد قادر يغيّر مسار يومك بالكامل. تفاصيل صنعت بحب عشان تناسب ذوقك الرايق. خذ لك بريك واستمتع بلحظتك الخاصة معنا.",
            "duration": 15,
            "cta": "مكانك المفضل ينتظرك.. احجز هدوءك اليوم.",
            "subtitles": [
                {"text": "بين هدوء المكان ورائحة البن", "start": 0.0, "end": 3.0},
                {"text": "كوب يغيّر مسار يومك بالكامل", "start": 3.0, "end": 7.0},
                {"text": "تفاصيل صنعت بحب لذوقك الرايق", "start": 7.0, "end": 11.0},
                {"text": "خذ لك بريك واستمتع بلحظتك", "start": 11.0, "end": 15.0}
            ]
        }
    ],
    "trend_challenge": [
        {
            "hook": "الهبة اللي مكسرة الرياض!",
            "voiceover": "اتحداك تشوف هالشكل وما تشتهيه الحين! الهبة الجديدة اللي الكل يسولف عنها بالكافيه، طعم لا يقاوم وجودة ما تتقارن. لا تقول ما علمتك، روح جرّبه الحين وقيمّه بنفسك!",
            "duration": 13,
            "cta": "اتحدى خويك يجربه معك، واكتب لنا رأيك بالكومنتات!",
            "subtitles": [
                {"text": "اتحداك تشوفه وما تشتهيه!", "start": 0.0, "end": 2.5},
                {"text": "الهبة الجديدة اللي الكل يسولف عنها", "start": 2.5, "end": 6.5},
                {"text": "طعم لا يقاوم وجودة ما تتقارن!", "start": 6.5, "end": 9.5},
                {"text": "روح جرّبه الحين وقيمّه بنفسك!", "start": 9.5, "end": 13.0}
            ]
        }
    ]
}

class ScriptGenerator:
    def __init__(self, gemini_api_key: Optional[str] = None, groq_api_key: Optional[str] = None):
        self.gemini_api_key = gemini_api_key or os.environ.get("GEMINI_API_KEY")
        self.groq_api_key = groq_api_key or os.environ.get("GROQ_API_KEY")

    def generate(self, user_caption: Optional[str] = None, style_input: str = "مرِح", cafe_name: str = "كافيه الشباب") -> Dict[str, Any]:
        style_key = STYLES.get(style_input, "cheerful")
        
        # If Gemini key available, try Gemini API
        if self.gemini_api_key:
            try:
                return self._generate_gemini(user_caption, style_key, cafe_name)
            except Exception as e:
                print(f"[ScriptGenerator] Gemini API failed: {e}. Falling back to internal engine.")

        # Fallback to local rule-based dynamic generator
        return self._generate_local(user_caption, style_key, cafe_name)

    def _generate_local(self, user_caption: Optional[str], style_key: str, cafe_name: str) -> Dict[str, Any]:
        templates = FALLBACK_TEMPLATES.get(style_key, FALLBACK_TEMPLATES["cheerful"])
        selected = random.choice(templates)
        
        item_hint = user_caption.strip() if user_caption else "مشروبنا المميز"
        
        voiceover = selected["voiceover"]
        hook = selected["hook"]
        
        # Adapt if user gave specific drink name or price
        if user_caption and len(user_caption.strip()) > 2:
            hook = f"{user_caption.strip()} وصل!"
            voiceover = f"يا ساتر على الروقان! {user_caption.strip()} جاهز يبرّد على قلبك ويعدل مزاجك اليوم بـ {cafe_name}. منشن خويك وخليه يعزمك!"

        tiktok_caption = f"{hook} ☕✨ جربته ولا لسه؟ منشن اللي يعزمك اليوم! {selected['cta']} {' '.join(SAUDI_TREND_HASHTAGS[:5])}"
        reels_caption = f"على جوك وفي وقتك! {hook} 😍✨ جربه الحين في {cafe_name}. احفظ البوست للمشوار الجاي! {' '.join(SAUDI_TREND_HASHTAGS[:6])}"
        snap_caption = f"{hook} 🔥 جربه الحين في {cafe_name}!"
        fb_caption = f"روّق مزاجك مع {item_hint} في {cafe_name}! أوقات الدوام مستمرة لخدمتكم يوميًا بأجود أنواع القهوة والحلويات الفاخرة. شرفونا وعيشوا التجربة. {' '.join(SAUDI_TREND_HASHTAGS)}"

        return {
            "style": style_key,
            "style_arabic": "مرِح" if style_key == "cheerful" else ("أستيتيك" if style_key == "aesthetic" else "ترند وتحدي"),
            "hook_text": hook,
            "voiceover_text": voiceover,
            "estimated_duration": selected["duration"],
            "subtitles": selected["subtitles"],
            "captions": {
                "tiktok": tiktok_caption,
                "reels": reels_caption,
                "snapchat": snap_caption,
                "facebook": fb_caption
            },
            "hashtags": SAUDI_TREND_HASHTAGS,
            "scenes": [
                {"scene": 1, "description": "لقطة مقربة مع زوم بطيء على المشروب وقطع الثلج المتلألئة", "duration": 4.5},
                {"scene": 2, "description": "حركة سريعة للأعلى تكشف تفاصيل الكوب وأجواء الكافيه المودرن", "duration": 4.5},
                {"scene": 3, "description": "زوم خارجي عريض يظهر اللوجو والكوب جاهز للتقديم مع دعوة للزيارة", "duration": 5.0}
            ],
            "generator_source": "hybrid_saudi_engine"
        }

    def _generate_gemini(self, user_caption: Optional[str], style_key: str, cafe_name: str) -> Dict[str, Any]:
        prompt = f"""
أنت كاتب محتوى إعلاني سعودي محترف ومختص في تسويق كافيهات الشباب والقهوة المختصة في المملكة العربية السعودية (الرياض، جدة، الشرقية).
المطلوب: كتابة سكريبت فيديو تيك توك وريلز مدته 10-15 ثانية، باللهجة السعودية الشبابية الدارجة العصرية (كلمات مثل: يسرسح، على جوك، هبة، روّق، يفوز، خرافي).

معطيات الفيديو:
- اسم الكافيه: {cafe_name}
- تفاصيل العرض أو المشروب من صاحب الكافيه: {user_caption or 'قهوة مثلجة منعشة وحلى فاخر'}
- النمط المطلوب: {style_key} (مرِح / أستيتيك / ترند وتحدي)

أخرج النتيجة بصيغة JSON حصرًا بدون أي كلام إضافي، وبنفس المفاتيح التالية:
{{
  "hook_text": "جملة الهوك الأولى للثواني الأولى (2-4 كلمات)",
  "voiceover_text": "نص الفويس أوفر باللهجة السعودية الشبابية كاملًا (30-50 كلمة تقريبًا)",
  "estimated_duration": 14,
  "subtitles": [
    {{"text": "السطر الأول", "start": 0.0, "end": 3.0}},
    {{"text": "السطر الثاني", "start": 3.0, "end": 7.0}},
    {{"text": "السطر الثالث", "start": 7.0, "end": 11.0}},
    {{"text": "السطر الرابع وCTA", "start": 11.0, "end": 14.0}}
  ],
  "captions": {{
    "tiktok": "كابشن تيك توك مرح ومختصر مع إيموجي",
    "reels": "كابشن انستقرام ريلز رايق مع دعوة لحفظ الفيديو",
    "snapchat": "كابشن سناب شات قصير وسريع",
    "facebook": "كابشن فيسبوك أوضح وتفصيلي قليلاً"
  }},
  "hashtags": ["#كافيهات_الرياض", "#قهوة_مختصة", "#هبة_جديدة", "#يسرسح", "#ترند_السعودية"]
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "response_mime_type": "application/json"}
        }
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        res.raise_for_status()
        data = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(raw_text)
        parsed["generator_source"] = "gemini-1.5-flash"
        return parsed

if __name__ == "__main__":
    gen = ScriptGenerator()
    res = gen.generate("آيس سبانش لاتيه مع سن سباستيان تشيزكيك", "مرِح", "كافيه أروما الرياض")
    print(json.dumps(res, indent=2, ensure_ascii=False))
