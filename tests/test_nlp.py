"""
Unit Tests for ReviewSense NLP Engine.
Tests text cleaning, single prediction, probability bounds, empty handling,
theme extraction, and dashboard summary generation.
"""

import pytest
import pandas as pd
from reviewsense import clean_text, SentimentEngine, extract_themes, extract_word_frequency, get_dashboard_data

@pytest.fixture(scope="module")
def engine():
    return SentimentEngine()

def test_clean_text_basic():
    raw = "  Great product!! Delivered on-time: https://example.com/item #awesome  "
    cleaned = clean_text(raw)
    assert "https" not in cleaned
    assert "!" not in cleaned
    assert "great product" in cleaned
    assert "delivered on time" in cleaned or "delivered ontime" in cleaned

def test_clean_text_empty_and_none():
    assert clean_text("") == ""
    assert clean_text(None) == ""
    assert clean_text("   \n\t   ") == ""

def test_predict_one_positive(engine):
    res = engine.predict_one("The product is fantastic and customer support was exceptionally helpful!")
    assert res["sentiment"] == "Positive"
    assert res["confidence"] > 40.0
    assert "Positive" in res["probabilities"]
    assert "Negative" in res["probabilities"]
    assert "Neutral" in res["probabilities"]
    assert abs(sum(res["probabilities"].values()) - 100.0) < 1.0

def test_predict_one_negative(engine):
    res = engine.predict_one("Completely defective unit. It broke immediately and support refused a refund.")
    assert res["sentiment"] == "Negative"
    assert res["confidence"] > 50.0

def test_predict_one_empty_raises(engine):
    with pytest.raises(ValueError):
        engine.predict_one("")
    with pytest.raises(ValueError):
        engine.predict_one("   ")

def test_themes_extraction():
    df = pd.DataFrame({
        "review": [
            "Customer service was rude and the agent unhelpful.",
            "Great build quality and sturdy materials.",
            "Shipping delivery was delayed by two weeks."
        ],
        "sentiment": ["Negative", "Positive", "Negative"]
    })
    themes = extract_themes(df)
    assert len(themes) >= 2
    theme_names = [t["theme"] for t in themes]
    assert "Customer Service" in theme_names
    assert "Product Quality" in theme_names

def test_word_frequency():
    df = pd.DataFrame({
        "review": [
            "Excellent speed and outstanding performance.",
            "Terrible customer service and bad experience.",
            "Normal delivery and standard packaging."
        ],
        "sentiment": ["Positive", "Negative", "Neutral"]
    })
    freq = extract_word_frequency(df)
    assert "All" in freq
    assert "Positive" in freq
    assert "Negative" in freq
    assert "Neutral" in freq
    assert len(freq["All"]) > 0

def test_dashboard_data_structure(engine):
    data = get_dashboard_data(engine)
    assert "summary" in data
    assert "total" in data["summary"]
    assert data["summary"]["total"] > 0
    assert "trend" in data
    assert "channels" in data
    assert "themes" in data
    assert "word_frequency" in data
    assert "reviews" in data
