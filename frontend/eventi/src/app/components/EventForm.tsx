// components/EventForm.tsx
import React, { useState } from 'react';

interface Event {
  id: number;
  nome_evento: string;
  attendees: string;
  data_evento: string;
}

interface Props {
  event: Event;
  onSubmit: (updatedEvent: Event) => void;
}

const EventForm: React.FC<Props> = ({ event, onSubmit }) => {
  const [editedEvent, setEditedEvent] = useState<Event>(event);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(editedEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
      <div className="mb-4">
        <label htmlFor="nome_evento" className="block text-gray-700 text-sm font-bold mb-2">
          Nome Evento:
        </label>
        <input
          type="text"
          id="nome_evento"
          name="nome_evento"
          value={editedEvent.nome_evento}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="attendees" className="block text-gray-700 text-sm font-bold mb-2">
          Attendees:
        </label>
        <input
          type="text"
          id="attendees"
          name="attendees"
          value={editedEvent.attendees}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="data_evento" className="block text-gray-700 text-sm font-bold mb-2">
          Data Evento:
        </label>
        <input
          type="date"
          id="data_evento"
          name="data_evento"
          value={editedEvent.data_evento}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Save
      </button>
    </form>
  );
};

export default EventForm;
