"use client"
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import EventForm from '../components/EventForm';

const AddEvent: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    try {
        const headers = {
            'Session-Id': sessionStorage.getItem("sessionId") ,
            'email': sessionStorage.getItem("email"),
          };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}events`,event,{headers});
      router.push('/events');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div>
      <h1>Add Event</h1>
      <EventForm event={{ id: 0, nome_evento: '', attendees: "", data_evento: '' }} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddEvent;
