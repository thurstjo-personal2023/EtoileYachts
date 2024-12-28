import * as tf from '@tensorflow/tfjs';

// Features used for yacht recommendations
export interface YachtFeatures {
  size: number; // in feet
  price: number;
  capacity: number;
  luxuryScore: number; // 1-10
  location: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  preferredSize: number;
  budget: number;
  partySize: number;
  luxuryPreference: number;
  preferredLocation: {
    lat: number;
    lng: number;
  };
}

export class YachtRecommendationEngine {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Create a simple neural network
    const model = tf.sequential();
    
    // Input layer with 6 features
    model.add(tf.layers.dense({
      units: 10,
      activation: 'relu',
      inputShape: [6]
    }));
    
    // Hidden layer
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    // Output layer (similarity score)
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });
    
    this.model = model;
  }

  // Convert yacht features to tensor
  private featuresToTensor(features: YachtFeatures, preferences: UserPreferences): tf.Tensor {
    // Normalize features
    const normalizedFeatures = [
      features.size / preferences.preferredSize, // size ratio
      features.price / preferences.budget, // price ratio
      features.capacity / preferences.partySize, // capacity ratio
      features.luxuryScore / preferences.luxuryPreference, // luxury ratio
      // Location similarity (simplified distance calculation)
      Math.abs(features.location.lat - preferences.preferredLocation.lat) / 180,
      Math.abs(features.location.lng - preferences.preferredLocation.lng) / 360,
    ];
    
    return tf.tensor2d([normalizedFeatures], [1, 6]);
  }

  async predictSimilarity(yacht: YachtFeatures, preferences: UserPreferences): Promise<number> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const features = this.featuresToTensor(yacht, preferences);
    const prediction = await this.model.predict(features) as tf.Tensor;
    const score = (await prediction.data())[0];
    
    // Cleanup tensors
    features.dispose();
    prediction.dispose();
    
    return score;
  }

  // Get top N yacht recommendations
  async getTopRecommendations(
    yachts: YachtFeatures[],
    preferences: UserPreferences,
    limit: number = 5
  ): Promise<{ yacht: YachtFeatures; score: number }[]> {
    const recommendations = await Promise.all(
      yachts.map(async (yacht) => ({
        yacht,
        score: await this.predictSimilarity(yacht, preferences)
      }))
    );

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

// Singleton instance
export const recommendationEngine = new YachtRecommendationEngine();
