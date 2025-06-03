import React from 'react';
import { useParams } from 'react-router-dom';

const EventWrapper = ({ children }) => {
    const { eventId } = useParams();

    // Ensure children is a single valid React element
    if (!React.isValidElement(children)) {
        return null;
    }

    // Clone the child and inject eventId as a prop
    return React.cloneElement(children, { eventId });
};

export default EventWrapper;
