"""
API Integration Tests for ReviewSense Flask Application.
Tests /api/health, /api/dashboard, /api/analyze, /api/upload, /api/export,
/api/reset, and /api/metrics endpoints.
"""

import io
import json
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"

def test_dashboard_endpoint(client):
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    payload = data["data"]
    assert "summary" in payload
    assert payload["summary"]["total"] >= 0
    assert "positive" in payload["summary"]
    assert "neutral" in payload["summary"]
    assert "negative" in payload["summary"]
    assert "channels" in payload
    assert "themes" in payload
    assert "trend" in payload
    assert "reviews" in payload

def test_analyze_positive(client):
    res = client.post("/api/analyze", json={
        "text": "The product is absolutely fantastic and customer support was exceptionally helpful!"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["data"]["sentiment"] == "Positive"
    assert data["data"]["confidence"] > 40.0
    assert "probabilities" in data["data"]

def test_analyze_negative(client):
    res = client.post("/api/analyze", json={
        "text": "Terrible customer service. Device broke on day one and support refused a refund."
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["data"]["sentiment"] == "Negative"
    assert data["data"]["confidence"] > 50.0

def test_analyze_empty(client):
    res = client.post("/api/analyze", json={"text": "   "})
    assert res.status_code == 400
    data = res.get_json()
    assert data["status"] == "error"
    assert "empty" in data["message"].lower()

def test_upload_missing_file(client):
    res = client.post("/api/upload")
    assert res.status_code == 400
    data = res.get_json()
    assert data["status"] == "error"

def test_upload_valid_csv(client):
    csv_content = """review,channel,date
"Exceptional speed and great user interface.",Website,2026-10-22
"Flimsy construction that snapped on day three.",Chat,2026-10-23
"""
    data = {
        "file": (io.BytesIO(csv_content.encode("utf-8")), "test_reviews.csv")
    }
    res = client.post("/api/upload", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    resp_data = res.get_json()
    assert resp_data["status"] == "success"
    assert resp_data["imported_count"] == 2

def test_upload_invalid_csv_no_review_col(client):
    csv_content = """order_id,price,quantity
1001,29.99,2
1002,15.50,1
"""
    data = {
        "file": (io.BytesIO(csv_content.encode("utf-8")), "invalid.csv")
    }
    res = client.post("/api/upload", data=data, content_type="multipart/form-data")
    assert res.status_code == 400
    resp_data = res.get_json()
    assert resp_data["status"] == "error"
    assert "review" in resp_data["message"].lower()

def test_upload_product_reviews_mock_format(client):
    csv_content = """ReviewID,ProductID,UserID,Rating,ReviewText,ReviewDate
REV-001,PROD-101,USER-77,5,"Outstanding battery life and great build quality.",2026-10-22
"""
    data = {
        "file": (io.BytesIO(csv_content.encode("utf-8")), "product_reviews_mock_data.csv")
    }
    res = client.post("/api/upload", data=data, content_type="multipart/form-data")
    assert res.status_code == 200
    resp_data = res.get_json()
    assert resp_data["status"] == "success"
    assert resp_data["imported_count"] == 1

def test_export_endpoint(client):
    res = client.get("/api/export")
    assert res.status_code == 200
    assert res.mimetype == "text/csv"
    assert "Content-Disposition" in res.headers
    content = res.data.decode("utf-8")
    assert "review,sentiment,confidence,channel,date" in content

def test_reset_endpoint(client):
    res = client.post("/api/reset")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert "Restored" in data["message"]

def test_metrics_endpoint(client):
    res = client.get("/api/metrics")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    metrics = data["data"]
    assert "accuracy" in metrics
    assert "macro_f1" in metrics
    assert "confusion_matrix" in metrics
    assert "per_class_metrics" in metrics
