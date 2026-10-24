# Product Requirements Document (PRD)
## ReviewSense — Customer Review Intelligence

**Version:** 1.0  
**Product type:** NLP analytics web application

## 1. Overview

ReviewSense helps teams understand customer feedback by analyzing review text and presenting sentiment patterns in a dashboard. The product turns unstructured comments into accessible sentiment summaries and topic-level insights.

## 2. Problem statement

Businesses can receive hundreds or thousands of reviews across email, chat, social media, and other channels. Reading every comment manually is time-consuming, inconsistent, and makes it difficult to spot recurring issues.

## 3. Goals and objectives

- Classify each review as Positive, Neutral, or Negative.
- Show aggregate sentiment counts and percentages.
- Compare sentiment across feedback channels.
- Surface frequent words and recurring themes.
- Allow users to analyze a single review.
- Support CSV import and analysis export.
- Provide a clear, responsive dashboard.

## 4. Target users

- Customer experience teams
- Product managers
- Small business owners
- Market researchers
- Students demonstrating NLP concepts

## 5. Core requirements

### Functional requirements

1. The dashboard must display total reviews and sentiment counts.
2. The dashboard must visualize sentiment trends.
3. The dashboard must show sentiment distribution by channel.
4. The dashboard must summarize common feedback topics.
5. Users must be able to submit one review for analysis.
6. Users must be able to upload a CSV containing a `review` column.
7. Users must be able to export analyzed reviews to CSV.
8. Users must be able to search recent reviews.
9. The interface must display clear errors for invalid input or file uploads.

### Non-functional requirements

- Responsive layout for desktop and mobile.
- Readable contrast and accessible form labels.
- Predictable error handling.
- No secret keys required for local development.
- Avoid logging or exposing confidential customer text unnecessarily.
- Keep model limitations visible in project documentation.

## 6. Success metrics

- Valid CSV imports complete without errors.
- Every non-empty review receives a predicted label and confidence score.
- Dashboard metrics update after importing data.
- Core pages remain usable at mobile and desktop widths.
- Model performance is measured on held-out labeled data before real-world use.

## 7. Out of scope for the initial version

- Multi-user authentication and role permissions
- Live integrations with email, chat, or social media APIs
- Production-grade multilingual sentiment analysis
- Automated customer replies
- Claims of reliable emotion detection beyond sentiment classification

## 8. Risks and assumptions

- The starter model is trained on a small sample and may not generalize.
- Sarcasm, mixed opinions, spelling errors, and domain-specific language can reduce accuracy.
- Imported data must have consistent column names.
- Date trend charts depend on valid dates.
- Public deployment requires security, privacy, and operational review.
