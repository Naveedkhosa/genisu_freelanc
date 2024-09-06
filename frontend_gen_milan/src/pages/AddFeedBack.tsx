import React, { useState } from 'react';

const FeedbackForm = () => {
  const [rating, setRating] = useState('');
  const [reasons, setReasons] = useState('');
  const [contactAllowed, setContactAllowed] = useState(true);
  const [joinResearch, setJoinResearch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      rating,
      reasons,
      contactAllowed,
      joinResearch,
    });
    // Handle form submission here
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">Give Feedback</h2>
      <p className="text-gray-600 mb-4">What do you think of the issue search experience within Jira projects?</p>

      {/* Rating Options */}
      <div className="flex justify-between w-full mb-6 space-x-3">
        {[
          { label: 'Terrible', emoji: '😨', value: 'Terrible' },
          { label: 'Bad', emoji: '😔', value: 'Bad' },
          { label: 'Okay', emoji: '😐', value: 'Okay' },
          { label: 'Good', emoji: '😊', value: 'Good' },
          { label: 'Amazing', emoji: '😆', value: 'Amazing' },
        ].map((option, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer text-sm font-medium w-20 h-20
            ${rating === option.value ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-600'}
            hover:bg-blue-50`}
            onClick={() => setRating(option.value)}
          >
            <span className="text-2xl">{option.emoji}</span>
            <span>{option.label}</span>
          </div>
        ))}
      </div>

      {/* Reasons Textarea */}
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-6"
        placeholder="What are the main reasons for your rating?"
        value={reasons}
        onChange={(e) => setReasons(e.target.value)}
      />

      {/* Checkboxes */}
      <div className="flex flex-col space-y-2 w-full mb-6">
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={contactAllowed}
            onChange={() => setContactAllowed(!contactAllowed)}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          I may be contacted about this feedback.
        </label>
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={joinResearch}
            onChange={() => setJoinResearch(!joinResearch)}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          I’d like to help improve by joining the Research Group.
        </label>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
        <button
          className="text-gray-500 py-2 px-6 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
