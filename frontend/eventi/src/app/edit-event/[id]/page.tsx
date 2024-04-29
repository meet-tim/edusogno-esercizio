"use client";

import React from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import EventForm from '@/app/components/EventForm';

const EditEvent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/")[2];
console.log(id + 'here');
  const handleSubmit = async (event: any) => {
    try {
      const headers = {
        'Session-Id': sessionStorage.getItem("sessionId") ,
        'email': sessionStorage.getItem("email"),
      };
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}events/${id}`, event,{headers});
      router.push('/events');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div>
      <h1>Edit Event</h1>
      {id && (
        <EventForm
          event={{ id: Number(id), nome_evento: '', attendees: "", data_evento: '' }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EditEvent;
