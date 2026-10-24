"""
Model Training and Evaluation Script for ReviewSense.
Trains TF-IDF + Logistic Regression on labeled data, performs stratified train/test split,
computes comprehensive evaluation metrics (Accuracy, Precision, Recall, Macro-F1, Confusion Matrix),
and persists the model artifact and metrics JSON.
"""

import os
import sys
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TrainModel")

# Ensure root dir is in path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from reviewsense import SentimentEngine, TRAINING_DATA_PATH, MODEL_PATH, METRICS_PATH

def main():
    logger.info("Initializing Sentiment Engine and Training Pipeline...")
    logger.info(f"Training dataset: {TRAINING_DATA_PATH}")
    
    # Force train and evaluate
    engine = SentimentEngine.__new__(SentimentEngine)
    engine.model_path = MODEL_PATH
    engine.classes = ["Negative", "Neutral", "Positive"]
    engine.train_and_save(TRAINING_DATA_PATH)

    metrics = engine.evaluation_metrics
    logger.info("=" * 60)
    logger.info("MODEL EVALUATION RESULTS (HELD-OUT TEST SET)")
    logger.info("=" * 60)
    logger.info(f"Model Version:    {metrics.get('model_version')}")
    logger.info(f"Total Dataset:    {metrics.get('total_samples')} samples")
    logger.info(f"Train / Test:     {metrics.get('train_samples')} / {metrics.get('test_samples')}")
    logger.info(f"Accuracy:         {metrics.get('accuracy')}%")
    logger.info(f"Macro Precision:  {metrics.get('macro_precision')}%")
    logger.info(f"Macro Recall:     {metrics.get('macro_recall')}%")
    logger.info(f"Macro F1-Score:   {metrics.get('macro_f1')}%")
    logger.info("-" * 60)
    logger.info("Per-Class Breakdown:")
    for label, vals in metrics.get("per_class_metrics", {}).items():
        logger.info(f"  {label:<10} | Prec: {vals['precision']:>5}% | Rec: {vals['recall']:>5}% | F1: {vals['f1_score']:>5}% (Support: {vals['support']})")
    logger.info("-" * 60)
    logger.info("Confusion Matrix:")
    labels = metrics.get("confusion_matrix", {}).get("labels", [])
    matrix = metrics.get("confusion_matrix", {}).get("matrix", [])
    header = "True \\ Pred | " + " | ".join(f"{l:>8}" for l in labels)
    logger.info(header)
    for row_label, row in zip(labels, matrix):
        logger.info(f"{row_label:<11} | " + " | ".join(f"{val:>8}" for val in row))
    logger.info("=" * 60)
    logger.info(f"Artifact successfully saved to {MODEL_PATH}")
    logger.info(f"Evaluation metrics saved to {METRICS_PATH}")

if __name__ == "__main__":
    main()
