import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { query } = req.body;

            const response = await axios.post('http://127.0.0.1:5050/api/gemini', {
            query
            });


            return res.status(200).json(response.data);
        } catch (error) {
            console.error('API call error:', error.response?.data || error.message);
            return res.status(500).json({
                error: 'Internal Server Error',
                details: error.response?.data || error.message
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
