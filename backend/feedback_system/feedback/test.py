from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize the VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Your feedback text
feedback = "The service was okay, but it didn’t stand out. Everything worked as expected, though there wasn’t anything exceptional about the experience."

# Get the sentiment scores
sentiment_score = analyzer.polarity_scores(feedback)

# Print the sentiment score
print(sentiment_score)
