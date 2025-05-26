import React from 'react';
import { useParams } from 'react-router-dom';

const EventWrapper = ({ children }) => {
    const { eventId } = useParams();

    // Clone the child and inject eventId as a prop
    return React.cloneElement(children, { eventId });
};

export default EventWrapper;
