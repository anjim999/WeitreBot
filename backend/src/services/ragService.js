import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RAG service — TF-IDF similarity search to find relevant docs
class RAGService {
    constructor() {
        this.documents = [];
        this.idf = {};
        this.docTermFrequencies = [];
        this.stopWords = new Set([
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
            'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
            'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
            'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
            'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
            'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
            'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
            'just', 'because', 'but', 'and', 'or', 'if', 'while', 'about', 'it',
            'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our',
            'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their',
            'what', 'which', 'who', 'whom'
        ]);
        this.loadDocuments();
    }

    // Load documents from docs.json and build TF-IDF index
    loadDocuments() {
        try {
            const docsPath = path.join(__dirname, '..', 'data', 'docs.json');
            const rawData = fs.readFileSync(docsPath, 'utf-8');
            this.documents = JSON.parse(rawData);

            this.buildIndex();
            console.log(`📚 RAG Service loaded ${this.documents.length} documents`);
        } catch (error) {
            console.error('❌ Failed to load documents:', error.message);
            this.documents = [];
        }
    }

    // Tokenize text into cleaned terms
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !this.stopWords.has(word));
    }

    // Build TF-IDF index for all documents
    buildIndex() {
        const docCount = this.documents.length;
        const termDocCount = {};

        // Calculate term frequencies for each document
        this.docTermFrequencies = this.documents.map((doc) => {
            const text = `${doc.title} ${doc.title} ${doc.content}`; // title weighted 2x
            const terms = this.tokenize(text);
            const tf = {};
            const totalTerms = terms.length;

            for (const term of terms) {
                tf[term] = (tf[term] || 0) + 1;
            }

            // Normalize term frequency
            for (const term in tf) {
                tf[term] = tf[term] / totalTerms;
                termDocCount[term] = (termDocCount[term] || 0) + 1;
            }

            return tf;
        });

        // Calculate IDF
        for (const term in termDocCount) {
            this.idf[term] = Math.log(docCount / termDocCount[term]);
        }
    }

    // Calculate TF-IDF similarity score between query and a document
    calculateSimilarity(queryTerms, docIndex) {
        const docTf = this.docTermFrequencies[docIndex];
        let score = 0;

        for (const term of queryTerms) {
            if (docTf[term] && this.idf[term]) {
                score += docTf[term] * this.idf[term];
            }
        }

        return score;
    }

    // Find the most relevant documents for a given query
    findRelevantDocs(query, topK = 3) {
        if (this.documents.length === 0) {
            return [];
        }

        const queryTerms = this.tokenize(query);

        if (queryTerms.length === 0) {
            return [];
        }

        // Score each document
        const scored = this.documents.map((doc, index) => ({
            ...doc,
            score: this.calculateSimilarity(queryTerms, index)
        }));

        // Filter and sort by relevance
        const relevant = scored
            .filter(doc => doc.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        return relevant;
    }

    // Build context string from relevant documents
    buildContext(query) {
        const relevantDocs = this.findRelevantDocs(query, 3);

        if (relevantDocs.length === 0) {
            return {
                context: '',
                docsUsed: [],
                hasRelevantDocs: false
            };
        }

        const context = relevantDocs
            .map(doc => `[${doc.title}]: ${doc.content}`)
            .join('\n\n');

        return {
            context,
            docsUsed: relevantDocs.map(d => ({ title: d.title, score: d.score.toFixed(4) })),
            hasRelevantDocs: true
        };
    }

    // Get all documents
    getAllDocs() {
        return this.documents;
    }
}

const ragService = new RAGService();
export default ragService;
