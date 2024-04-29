"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import {Event} from '../components/EventCard'

const EventListing: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
      const fetchEvents = async () => {
        try {
            const headers = {
                'Session-Id': sessionStorage.getItem("sessionId") ,
                'email': sessionStorage.getItem("email"),
              };
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/myevents`,{headers});
          setEvents(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
  
      fetchEvents();
    }, []);

  return (
    <div>
      <Navbar />
      <div className="bg-white container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">My Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} isJoined={true}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventListing;
