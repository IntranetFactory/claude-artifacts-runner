import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import Mistral from 'mistral-ai';

class LLMProxy {
  constructor(config = {}) {
    this.providers = {
      anthropic: {
        client: new Anthropic({
          apiKey: config.anthropicApiKey || process.env.ANTHROPIC_API_KEY
        }),
        defaultModel: 'claude-3-haiku-20240307',
        async complete(options) {
          const response = await this.client.messages.create({
            model: options.model || this.defaultModel,
            max_tokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7,
            messages: options.messages
          });
          return {
            content: response.content[0].text,
            fullResponse: response,
            provider: 'anthropic'
          };
        }
      },
      openai: {
        client: new OpenAI({
          apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY
        }),
        defaultModel: 'gpt-3.5-turbo',
        async complete(options) {
          const response = await this.client.chat.completions.create({
            model: options.model || this.defaultModel,
            max_tokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7,
            messages: options.messages
          });
          return {
            content: response.choices[0].message.content,
            fullResponse: response,
            provider: 'openai'
          };
        }
      },
      groq: {
        client: new Groq({
          apiKey: config.groqApiKey || process.env.GROQ_API_KEY
        }),
        defaultModel: 'llama2-70b-4096',
        async complete(options) {
          const response = await this.client.chat.completions.create({
            model: options.model || this.defaultModel,
            max_tokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7,
            messages: options.messages
          });
          return {
            content: response.choices[0].message.content,
            fullResponse: response,
            provider: 'groq'
          };
        }
      },
      mistral: {
        client: new Mistral({
          apiKey: config.mistralApiKey || process.env.MISTRAL_API_KEY
        }),
        defaultModel: 'mistral-small-latest',
        async complete(options) {
          const response = await this.client.chat.create({
            model: options.model || this.defaultModel,
            maxTokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7,
            messages: options.messages
          });
          return {
            content: response.choices[0].message.content,
            fullResponse: response,
            provider: 'mistral'
          };
        }
      }
    };

    this.currentProvider = config.defaultProvider || 'anthropic';
  }

  // Set the current provider
  setProvider(providerName) {
    if (!this.providers[providerName]) {
      throw new Error(`Provider ${providerName} not supported`);
    }
    this.currentProvider = providerName;
    return this;
  }

  // Get current provider
  getProvider() {
    return this.currentProvider;
  }

  // Proxy method to call completion
  async complete(options = {}) {
    const provider = this.providers[this.currentProvider];
    if (!provider) {
      throw new Error(`Current provider ${this.currentProvider} not configured`);
    }
    return provider.complete(options);
  }

  // Add a new provider dynamically
  addProvider(name, providerConfig) {
    this.providers[name] = providerConfig;
    return this;
  }

  // List available providers
  listProviders() {
    return Object.keys(this.providers);
  }
}

export default LLMProxy;