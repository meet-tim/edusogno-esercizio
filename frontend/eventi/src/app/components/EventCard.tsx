"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export interface Event {
  id: number;
  nome_evento: string;
  attendees: number;
  data_evento: string;
}

const EventCard: React.FC<{ event: Event, isJoined:boolean }> = ({ event ,isJoined}) => {
    const router = useRouter();
  const role = sessionStorage.getItem("role") 

  const handleEdit = () => {
    router.push(`/edit-event/${event.id}`);
  };

  const handleDelete = async () => {
    try {
      const headers = {
          'Session-Id': sessionStorage.getItem("sessionId") ,
          'email': sessionStorage.getItem("email"),
        };
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}events/${event.id}`,{headers});
    router.push("/myevents");
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  const handleJoin = async () => {
    try {
      const headers = {
          'Session-Id': sessionStorage.getItem("sessionId") ,
          'email': sessionStorage.getItem("email"),
        };
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}events/${event.id}`,"",{headers});
    router.push("/myevents")
  } catch (error) {
    console.error('Error fetching events:', error);
  }
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{event.nome_evento}</h2>
      <p>Attendees: {event.attendees}</p>
      <p>Date: {event.data_evento}</p>
      <div className="mt-4">
        {role == "admin" && (
          <>
            <button className="bg-yellow-500 p-2 rounded-md mr-2" onClick={handleEdit}>
              Edit
            </button>
            <button className="bg-red-500 rounded-md p-2 mr-2" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
        {isJoined == false &&
          <button className="bg-blue-500 rounded-md p-2 mr-2" onClick={handleJoin}>Join</button>
        }
        
      </div>
    </div>
  );
};

export default EventCard;
