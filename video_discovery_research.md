# Advanced Video Discovery and Recommendation Systems Research

## Table of Contents
1. [Introduction](#introduction)
2. [Current Trends in Video Recommendation Algorithms](#current-trends-in-video-recommendation-algorithms)
3. [Personalization Techniques for Content Discovery](#personalization-techniques-for-content-discovery)
4. [Innovative UI/UX Approaches for Video Exploration](#innovative-uiux-approaches-for-video-exploration)
5. [Methods to Balance User Preferences with Content Diversity](#methods-to-balance-user-preferences-with-content-diversity)
6. [Integration of AI for Smarter Recommendations](#integration-of-ai-for-smarter-recommendations)
7. [Successful Case Studies from Popular Video Platforms](#successful-case-studies-from-popular-video-platforms)
8. [Ways to Incorporate Social Signals into Discovery](#ways-to-incorporate-social-signals-into-discovery)
9. [Implementation Recommendations](#implementation-recommendations)
10. [References](#references)

## Introduction

Video discovery and recommendation systems have become essential components of modern digital platforms, particularly for YouTube companion applications. As users face an overwhelming amount of content, effective recommendation systems help them navigate this vast landscape by suggesting relevant videos based on their preferences, behavior, and contextual factors.

This research report explores advanced video discovery and recommendation systems, focusing on current trends, personalization techniques, UI/UX approaches, content diversity strategies, AI integration, case studies, and social signal incorporation. The findings aim to inform the development of an enhanced video discovery hub for a YouTube companion web app that already features AI agents and social features like interactive polls, co-watching sessions, content curation circles, and community challenges.

## Current Trends in Video Recommendation Algorithms

### Two-Phase Recommendation Architecture

Modern video recommendation systems typically employ a two-phase approach: retrieval and ranking. This architecture addresses the computational challenges of processing vast video catalogs efficiently:

1. **Retrieval Phase**: Quickly narrows down candidate videos using fast algorithms to identify a subset of potentially relevant content from the entire catalog.
2. **Ranking Phase**: Applies more complex models to the retrieved candidates to personalize recommendations and determine the final presentation order (Frontiers in Big Data, 2023).

This approach enables platforms to deliver personalized recommendations at scale while maintaining acceptable response times.

### Deep Learning for Content Understanding

Deep learning has revolutionized how recommendation systems understand video content. Current algorithms analyze multiple aspects of videos:

- **Visual Recognition**: Identifies objects, scenes, emotions, and visual aesthetics within video frames
- **Audio Analysis**: Processes speech patterns, background music, and sound effects to determine genre, mood, and production quality
- **Textual Processing**: Examines titles, descriptions, transcripts, and user comments to extract themes and sentiment

These multimodal analyses enable systems to develop a comprehensive understanding of video content beyond simple metadata tags, leading to more nuanced recommendations (IEEE, 2024).

### Hybrid Recommendation Models

The most effective contemporary systems combine multiple recommendation approaches:

- **Collaborative Filtering**: Analyzes user behavior patterns to find similarities between users and recommend content based on what similar users have enjoyed
- **Content-Based Filtering**: Matches video attributes with user preferences based on previously watched content
- **Knowledge-Based Approaches**: Incorporates domain expertise and contextual rules to improve recommendations

Hybrid models that integrate these approaches typically outperform single-method systems by 5-10% in accuracy metrics (LongStories.ai, 2025).

### Real-Time Personalization

Modern recommendation systems increasingly operate in real-time, continuously adapting to user interactions:

- **Session-Based Recommendations**: Analyze the current viewing session to adapt recommendations instantly based on recent interactions
- **Contextual Learning**: Consider situational factors like time of day, device type, and location
- **Edge Computing**: Process data closer to users for faster response times and improved privacy

These real-time capabilities enable more dynamic and responsive recommendation experiences (LongStories.ai, 2025).

## Personalization Techniques for Content Discovery

### Collaborative Filtering Approaches

Collaborative filtering remains a cornerstone of personalization in video discovery, leveraging collective user behavior to generate recommendations:

1. **User-Based Collaborative Filtering**: Identifies users with similar viewing patterns and recommends videos that similar users have enjoyed but the target user hasn't yet watched.
2. **Item-Based Collaborative Filtering**: Analyzes relationships between videos based on user interactions to recommend similar content.
3. **Matrix Factorization**: Employs techniques like Singular Value Decomposition (SVD) or Alternating Least Squares (ALS) to uncover latent preference patterns and predict user-item interactions.

These approaches excel at uncovering unexpected content connections but face challenges with new users or items (the "cold start" problem) and data sparsity (LongStories.ai, 2025).

### Content-Based Filtering Techniques

Content-based filtering recommends videos by analyzing their attributes and matching them with user preferences:

1. **Feature Extraction**: Processes video metadata (genre, actors, directors), visual elements, audio characteristics, and textual descriptions.
2. **User Profile Creation**: Builds profiles based on previously consumed content and explicit preferences.
3. **Similarity Matching**: Calculates similarity between user profiles and video features to generate recommendations.

This approach is particularly effective for new users or items and can provide more transparent recommendations. However, it may lead to overspecialization, limiting content diversity (LongStories.ai, 2025).

### Advanced Personalization Strategies

Several sophisticated techniques enhance personalization in video discovery:

1. **Multi-Modal Content Analysis**: Combines visual, auditory, and textual data for holistic content understanding:
   - **Text Analysis**: Examines titles, descriptions, transcripts, and comments
   - **Visual Recognition**: Identifies objects, scenes, and emotional cues
   - **Sound Pattern Analysis**: Processes speech, music, and sound effects

2. **Contextual Personalization**: Incorporates situational factors:
   - **Device Context**: Adapts recommendations based on the viewing device
   - **Temporal Context**: Considers time of day, day of week, and seasonal factors
   - **Location Context**: Uses geographical information to suggest relevant content

3. **Active Session Analysis**: Monitors real-time user interactions:
   - **Watch Duration**: Tracks how long users engage with different videos
   - **Interaction Patterns**: Analyzes pausing, skipping, scrolling, and other behaviors
   - **Sequential Viewing**: Considers the order and relationship between watched videos

These advanced strategies enable more nuanced and dynamic personalization, adapting to users' evolving preferences and contexts (LongStories.ai, 2025).

## Innovative UI/UX Approaches for Video Exploration

### Immersive and Interactive Interfaces

Modern video exploration interfaces are moving beyond traditional grid layouts to create more engaging and immersive experiences:

1. **Augmented Reality (AR) Integration**: Overlays interactive elements onto real-world environments, enabling virtual try-ons, product visualizations, and interactive maps.

2. **3D Elements and Animated Graphics**: Incorporates interactive 3D views, animated backgrounds, and engaging visual storytelling to improve engagement and create immersive experiences.

3. **Microinteractions**: Implements subtle animations and feedback mechanisms—such as hover effects, loading indicators, and button animations—to personalize and streamline interactions.

4. **Voice User Interface (VUI)**: Facilitates hands-free navigation through voice commands, especially valuable on smart devices and in multitasking scenarios.

These immersive approaches enhance user engagement by making video exploration more interactive and visually appealing (The Alien Design, 2025).

### User-Centric Design Patterns

Effective video exploration interfaces prioritize user needs and behaviors:

1. **Minimalism and Simple Design**: Emphasizes clarity by reducing clutter and focusing user attention on essential content through bold typography, vibrant accents, and well-structured layouts.

2. **Responsive and Mobile-First Design**: Ensures seamless experiences across devices by adapting fluidly to various screen sizes and input methods, with particular attention to touch gestures and remote controls.

3. **Seamless Cross-Platform Interactions**: Enables unified experiences across web, mobile, and smart TV platforms, allowing users to start a video on one device and continue on another effortlessly.

4. **Biometric Authentication**: Implements secure, seamless login experiences using facial recognition or fingerprint scanning to enhance security without compromising usability.

These user-centric patterns improve accessibility and ease of use, making video exploration more intuitive and enjoyable (Wendy Zhou, 2025).

### Content Presentation Innovations

Novel approaches to presenting video content enhance discovery and engagement:

1. **Dynamic Video Previews**: Automatically generates short previews that play when users hover over thumbnails, providing a quick glimpse of content without requiring a click.

2. **Contextual Content Grouping**: Organizes videos into thematic collections based on user interests, current events, or emerging trends rather than rigid categorical structures.

3. **Personalized Entry Points**: Creates multiple pathways to content discovery tailored to different user preferences and contexts, such as mood-based browsing, topic exploration, or creator-focused navigation.

4. **Interactive Video Maps**: Visualizes relationships between videos through interactive maps or networks that users can explore to discover connected content.

These presentation innovations help users discover relevant content more efficiently and engage with it more meaningfully (UX Planet, 2025).

## Methods to Balance User Preferences with Content Diversity

### The Filter Bubble Challenge

Recommendation systems that focus exclusively on personalization can create "filter bubbles" or echo chambers, limiting exposure to diverse perspectives and potentially reinforcing existing biases. This challenge has significant implications:

- **Reduced Content Discovery**: Users may miss valuable content outside their typical preferences
- **Reinforcement of Biases**: Existing viewpoints may be strengthened without exposure to alternative perspectives
- **User Fatigue**: Over-personalization can lead to predictable recommendations and diminished engagement

Addressing this challenge requires deliberate strategies to balance personalization with diversity (Medium, 2024).

### Adaptive Exploration-Based Frameworks

Recent advancements propose adaptive, exploration-based recommendation systems that dynamically adjust to user preferences and content distributions:

1. **Exploration Mechanisms**: Sample from under-explored content clusters to promote diversity without sacrificing relevance.
2. **Diversity Metrics**: Incorporate measures like intra-list similarity and unexpectedness to evaluate and enhance content variety.
3. **Dynamic Adjustment**: Adapt the exploration-exploitation balance based on user engagement patterns and feedback.

Experiments on datasets like MovieLens demonstrate that such systems can reduce intra-list similarity and increase unexpectedness, leading to more diverse yet personalized recommendations (arXiv, 2025).

### User Control and Transparency

Empowering users with control over their content discovery experience can help balance personalization and diversity:

1. **Preference Controls**: Allow users to adjust the balance between familiar and new content through explicit settings.
2. **Explanation Features**: Provide transparent explanations of why certain content is recommended to build trust and understanding.
3. **Diversity Toggles**: Implement features that enable users to temporarily increase content diversity for exploration purposes.

These user-centric approaches enhance trust and engagement by giving individuals agency over their content consumption (Medium, 2024).

### Algorithmic Approaches to Diversity

Several algorithmic techniques can promote content diversity while maintaining personalization:

1. **Re-ranking Strategies**: Apply post-processing to recommendation lists to increase diversity while preserving relevance.
2. **Multi-objective Optimization**: Balance multiple goals (relevance, novelty, diversity) simultaneously in the recommendation algorithm.
3. **Temporal Diversity**: Ensure variety over time by tracking recommendation history and avoiding repetitive content patterns.
4. **Categorical Diversity**: Maintain representation across different content categories, topics, or perspectives.

These approaches can be implemented at various stages of the recommendation pipeline to systematically enhance content diversity (Naviga, 2025).

## Integration of AI for Smarter Recommendations

### Deep Learning Architectures

Advanced AI models are transforming video recommendation systems through sophisticated deep learning architectures:

1. **Neural Collaborative Filtering**: Enhances traditional collaborative filtering by modeling complex user-item interactions using neural networks, capturing non-linear relationships that simpler models miss.

2. **Sequence Models**: Employs recurrent neural networks (RNNs), long short-term memory networks (LSTMs), or transformers to model sequential patterns in user behavior, understanding how preferences evolve over time.

3. **Graph Neural Networks (GNNs)**: Represents users, videos, and their interactions as nodes and edges in a graph, enabling the model to capture complex relationships and propagate information across the network.

4. **Multi-Modal Deep Learning**: Processes different data types (text, images, audio) simultaneously through specialized neural network components, creating unified representations that capture the full richness of video content.

These architectures significantly improve recommendation accuracy by learning complex patterns from large-scale data (IEEE Spectrum, 2025).

### Natural Language Processing for Content Understanding

NLP technologies enable deeper understanding of video content through textual analysis:

1. **Semantic Analysis**: Extracts meaning and context from video titles, descriptions, and transcripts to understand themes and topics.

2. **Sentiment Analysis**: Determines emotional tone in content and user comments to match videos with user mood preferences.

3. **Entity Recognition**: Identifies people, places, events, and concepts mentioned in videos to create rich content metadata.

4. **Topic Modeling**: Discovers latent topics across video collections to organize content and identify thematic relationships.

These NLP capabilities enhance content understanding beyond simple keyword matching, enabling more nuanced recommendations based on semantic relevance (LongStories.ai, 2025).

### Computer Vision for Visual Content Analysis

Computer vision technologies analyze visual elements within videos:

1. **Object and Scene Recognition**: Identifies objects, settings, and activities within video frames.

2. **Aesthetic Analysis**: Evaluates visual qualities like composition, color schemes, and production style.

3. **Emotion Detection**: Recognizes emotional expressions and mood indicators in visual content.

4. **Action Recognition**: Identifies human activities and movements to categorize content by type.

These visual analysis capabilities enable recommendations based on visual preferences and similarities that would be impossible to capture through metadata alone (IEEE Xplore, 2024).

### Reinforcement Learning for Optimization

Reinforcement learning approaches optimize recommendations through continuous feedback:

1. **Multi-Armed Bandit Algorithms**: Balance exploration (trying new content) with exploitation (recommending known preferences) to maximize user satisfaction over time.

2. **User Satisfaction Modeling**: Learn to predict user satisfaction from implicit feedback signals like watch time and engagement patterns.

3. **Long-Term Value Optimization**: Focus on maximizing long-term user engagement rather than immediate clicks, potentially sacrificing short-term metrics for sustained platform loyalty.

These approaches enable recommendation systems to continuously improve through interaction with users, adapting to changing preferences and content landscapes (Science News Today, 2025).

## Successful Case Studies from Popular Video Platforms

### YouTube: Engagement-Driven Recommendations

YouTube's recommendation system exemplifies a highly successful approach to video discovery:

1. **System Architecture**: Employs a two-stage process with a candidate generation network followed by a ranking network, both powered by deep neural networks.

2. **Key Metrics**: The recommendation engine drives approximately 75% of watched content on the platform, creating an "endless loop" of engaging content that significantly increases user retention.

3. **Technical Approach**: Combines collaborative filtering with deep learning for content analysis, incorporating watch time, engagement signals, and search history to personalize recommendations.

4. **Success Factors**: YouTube's system excels at introducing users to new creators and genres while maintaining relevance to their interests, creating a balance between familiarity and discovery.

This case demonstrates how sophisticated recommendation algorithms can directly impact platform engagement and growth (Peakermap, 2025).

### Netflix: Personalization at Scale

Netflix pioneered many approaches to video recommendation that have become industry standards:

1. **Business Impact**: The recommendation system influences over 75% of viewer activity, with personalized recommendations contributing to a 29% uplift in viewing hours and significant reduction in churn.

2. **Personalization Strategy**: Implements multiple specialized algorithms for different purposes:
   - Personalized video ranking for catalog browsing
   - Continue watching recommendations
   - Similarity-based content suggestions
   - Thumbnail and metadata personalization

3. **Technical Innovation**: Uses a combination of collaborative filtering, content-based approaches, and contextual factors (device, time of day) to create highly personalized experiences.

Netflix's success demonstrates how recommendation systems can become a core competitive advantage in the streaming industry (Amatria, 2025).

### TikTok: Algorithm-First Discovery

TikTok's recommendation algorithm represents a paradigm shift in content discovery:

1. **For You Page**: Creates highly personalized feeds that adapt quickly to user preferences, leading to exceptional engagement metrics—averaging 52 minutes of daily app usage per user.

2. **Technical Approach**: 
   - Analyzes detailed interaction data (likes, shares, comments, viewing duration)
   - Employs computer vision and audio analysis to understand content
   - Implements a real-time feedback loop that continuously updates recommendations

3. **Distinctive Features**: Unlike traditional platforms that prioritize social connections or creator popularity, TikTok's algorithm emphasizes content relevance above all, enabling unknown creators to reach large audiences based solely on content quality.

TikTok's case illustrates how an algorithm-first approach can rapidly build user engagement and platform growth (DigitalProductAnalytics, 2025).

### Spotify: Cross-Media Recommendation Insights

While primarily an audio platform, Spotify's recommendation approach offers valuable insights for video discovery:

1. **Discovery Features**: Creates personalized playlists like Discover Weekly that blend familiar preferences with new content, effectively preventing filter bubbles.

2. **Contextual Awareness**: Considers mood, time of day, and listening context to deliver situationally appropriate recommendations.

3. **Technical Approach**: Combines collaborative filtering, content analysis (genre, tempo, mood), and reinforcement learning to adapt recommendations based on user feedback.

Spotify's success in audio discovery provides transferable lessons for video platforms, particularly in balancing familiarity with discovery (Peakermap, 2025).

## Ways to Incorporate Social Signals into Discovery

### Types of Social Signals

Social signals provide valuable data points that can enhance video discovery and recommendations:

1. **Explicit Social Signals**:
   - Likes, shares, and comments on videos
   - User-generated tags and annotations
   - Ratings and reviews
   - Subscriptions to channels or creators

2. **Implicit Social Signals**:
   - Watch time and completion rates
   - Click-through patterns
   - Browsing behavior
   - Social graph connections (friends, followers)

3. **Contextual Social Signals**:
   - Trending topics within social networks
   - Community engagement patterns
   - Viral content indicators
   - Group viewing behaviors

These signals provide rich information about content quality, relevance, and social validation that can improve recommendation accuracy (IEEE Spectrum, 2025).

### Embedding Social Features in Video Platforms

Integrating social features directly into video discovery interfaces enhances engagement and creates valuable signal data:

1. **Interactive Elements**:
   - Comment sections with threading and reactions
   - One-click sharing to social networks
   - Collaborative playlists and collections
   - Reaction buttons beyond simple likes (e.g., emotional responses)

2. **Community Building Features**:
   - Group watch parties with synchronized playback
   - Discussion forums around content categories
   - Creator-fan interaction opportunities
   - Content curation circles where users recommend videos to each other

3. **Social Discovery Interfaces**:
   - "Friends are watching" sections
   - Community trending indicators
   - Social proof metrics (view counts, engagement statistics)
   - User-generated collections and playlists

These features not only generate valuable social signals but also enhance the platform experience through community engagement (Milvus.io, 2024).

### Algorithmic Integration of Social Signals

Social signals can be incorporated into recommendation algorithms in several ways:

1. **Social Graph Analysis**:
   - Analyze connections between users to identify communities with shared interests
   - Weight recommendations based on social proximity
   - Identify influential users whose preferences may impact others

2. **Social Proof Ranking**:
   - Incorporate engagement metrics into ranking algorithms
   - Boost content with high social validation within relevant communities
   - Consider the velocity of social signals (rapid growth in engagement)

3. **Collaborative Social Filtering**:
   - Extend collaborative filtering to include social connections
   - Develop trust-based recommendation models that prioritize signals from trusted connections
   - Implement social regularization in matrix factorization models

These approaches leverage the wisdom of crowds and social influence to improve recommendation relevance (ACM, 2020).

### Privacy and Ethical Considerations

When incorporating social signals, several important considerations must be addressed:

1. **User Consent and Control**:
   - Provide clear opt-in mechanisms for social data usage
   - Offer granular controls over what social information is used
   - Allow users to view and manage their social signal data

2. **Data Protection**:
   - Implement robust anonymization for shared social data
   - Secure storage and transmission of social interaction data
   - Comply with relevant privacy regulations (GDPR, CCPA)

3. **Algorithmic Fairness**:
   - Ensure social signal integration doesn't amplify existing biases
   - Monitor for filter bubble effects in socially-influenced recommendations
   - Maintain diversity despite social clustering tendencies

Addressing these considerations is essential for building user trust while leveraging the power of social signals (Common Sense Media, 2024).

## Implementation Recommendations

Based on our research findings, we recommend the following implementations to enhance the video discovery hub in your YouTube companion app:

### Architectural Recommendations

1. **Two-Phase Recommendation System**:
   - Implement a retrieval phase using lightweight models to quickly identify candidate videos
   - Develop a ranking phase with more sophisticated models to personalize the final recommendations
   - Design the system to scale efficiently with growing content and user bases

2. **Hybrid Recommendation Approach**:
   - Combine collaborative filtering, content-based filtering, and knowledge-based approaches
   - Weight different recommendation sources dynamically based on performance metrics
   - Implement A/B testing infrastructure to continuously optimize the recommendation mix

3. **Real-Time Processing Pipeline**:
   - Build a streaming data pipeline to process user interactions in real-time
   - Implement session-based recommendation capabilities that adapt within viewing sessions
   - Develop edge computing capabilities to reduce latency and enhance privacy

### Feature Recommendations

1. **Enhanced Personalization**:
   - Develop multi-modal content analysis capabilities (visual, audio, text)
   - Implement contextual personalization based on device, time, and location
   - Create user preference controls that allow explicit customization of recommendations

2. **Content Diversity Mechanisms**:
   - Implement exploration mechanisms that introduce diverse content strategically
   - Develop diversity metrics to monitor and optimize content variety
   - Create "discovery mode" features that temporarily increase exploration

3. **Social Integration**:
   - Build collaborative viewing features like watch parties and shared playlists
   - Implement social proof indicators that highlight community engagement
   - Develop friend-based recommendation features that leverage social connections

4. **Innovative UI/UX Elements**:
   - Design dynamic video previews that play on hover
   - Implement contextual content grouping based on themes and trends
   - Create interactive video maps that visualize content relationships
   - Develop cross-platform continuity features for seamless multi-device experiences

### Technical Implementation Priorities

1. **Short-Term Priorities** (1-3 months):
   - Implement basic hybrid recommendation system combining existing approaches
   - Develop essential social features (sharing, commenting, collaborative playlists)
   - Create user controls for personalization preferences and content diversity

2. **Medium-Term Goals** (3-6 months):
   - Build multi-modal content analysis capabilities
   - Implement real-time recommendation updates based on session data
   - Develop advanced UI elements for content exploration

3. **Long-Term Vision** (6-12 months):
   - Implement deep learning models for sophisticated content understanding
   - Develop comprehensive social graph analysis for recommendations
   - Create fully adaptive systems that balance personalization and diversity dynamically

By implementing these recommendations, your YouTube companion app can provide a state-of-the-art video discovery experience that balances personalization with diversity, leverages social signals effectively, and engages users through innovative interfaces.

## References

1. Frontiers in Big Data. (2023). An overview of video recommender systems: state-of-the-art and research issues. https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2023.1281614/full

2. LongStories.ai. (2025). How Recommendation Systems Personalize Video Content. https://longstories.ai/blog/how-recommendation-systems-personalize-video-content

3. IEEE Spectrum. (2025). Facebook's Video Recommendations Maven. https://spectrum.ieee.org/ai-expert-meta-video-recommendations

4. IEEE Xplore. (2024). Intelligent Short Video Recommendation System Based on Deep Learning. https://ieeexplore.ieee.org/document/10602710

5. UX Planet. (2025). Video Content As a Part of User Experience Design. https://uxplanet.org/video-content-as-a-part-of-user-experience-design-7487a67ee1b6

6. The Alien Design. (2025). Innovative UI Design Ideas to Elevate Digital Experiences in 2025. https://www.thealien.design/insights/ui-design-ideas

7. Wendy Zhou. (2025). Best Video Player UI Design Inspiration & UX Tips. https://www.wendyzhou.se/blog/video-player-ui-design-inspiration-tips/

8. Medium. (2024). Diverse Content Recommendations: Broadening Horizons and Reducing Polarization. https://medium.com/@socialautomation/diverse-content-recommendations-broadening-horizons-and-reducing-polarization-17989aae06c2

9. arXiv. (2025). Beyond Relevance: An Adaptive Exploration-Based Framework for Personalized Recommendations. https://arxiv.org/abs/2503.19525

10. Naviga. (2025). The Dilemma of Personalization and Diverse Perspectives in News Consumption. https://naviga.com/article

11. Science News Today. (2025). AI in Social Media: How Platforms Know What You Like. https://www.sciencenewstoday.org/ai-in-social-media-how-platforms-know-what-you-like

12. Peakermap. (2025). Real-World Examples: Recommendation Systems in Action. https://www.peakermap.com/blogs/news/real-world-examples-recommendation-systems-in-action

13. Amatria. (2025). Recommendation Systems in Industry. https://amatria.in/pubs/Recsys-in-industry.pdf

14. DigitalProductAnalytics. (2025). TikTok and the Art of Personalization: Investigating Exploration and Amplification. https://kvombatkere.github.io/assets/TikTok_Paper_WebConf24.pdf

15. Milvus.io. (2024). How can social features be integrated into video search platforms? https://milvus.io/ai-quick-reference/how-can-social-features-be-integrated-into-video-search-platforms

16. ACM. (2020). Socializing the Videos: A Multimodal Approach for Social Relation Recognition. https://dl.acm.org/doi/10.1145/3416493

17. Common Sense Media. (2024). Recommendation Systems in Social Media. https://www.commonsensemedia.org/ai-ratings/recommendation-systems-in-social-media
