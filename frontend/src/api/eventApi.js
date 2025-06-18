import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const API_URL = 'http://localhost:5000/api/events';

const API_URL2 = 'http://localhost:5000/api';

const API_URL3 = 'http://localhost:5000/invitations';

const API_URL4 = 'http://localhost:5000/api/guests'


const FRONTEND_BASE = 'http://localhost:5173';

const LOCAL_IP_BASE = 'http://192.168.1.7:5173';



const getToken = () => localStorage.getItem('token');


export const fetchAllEvents = async() => {
    const res = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
};

export const deleteEventById = async(eventId) => {
    await axios.delete(`${API_URL}/${eventId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

export const createEvent = async(formData) => {
    const res = await axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.data;
};