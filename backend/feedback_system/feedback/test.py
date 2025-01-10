from textblob import TextBlob

feedback = "The product is great, but the delivery was terrible."
blob = TextBlob(feedback)
print(blob.sentiment.polarity)
