import React from 'react';

const ContactUs:React.FC = () => {
  return (
    <div className="w-full bg-gray-50">
        <div className='container max-w-7xl place-self-center px-4 py-8'>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        At <strong>Learnlab</strong>, your feedback, questions, and suggestions are valuable to us. Whether you're 
        a student, instructor, or admin, we’re here to assist you.
      </p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch:</h2>
      <ul className="space-y-2 mb-6">
        <li>
          <strong>Email:</strong> <a href="#" className="text-blue-600">support@learnlab.com</a>
        </li>
        <li>
          <strong>Phone:</strong> +026 2020202
        </li>
        <li>
          <strong>Address:</strong> Kerala, India
        </li>
      </ul>
      <h3 className="text-xl font-medium text-gray-800 mb-2">Support Hours:</h3>
      <p className="text-gray-700 leading-relaxed">
        Monday to Friday: 9 AM – 6 PM (Local Time) <br />
        Saturday: 10 AM – 4 PM (Local Time) <br />
        Sunday: Closed
      </p>
      <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">Follow Us:</h3>
      <ul className="space-x-4 flex">
        <li><a href="#" className="text-blue-600">Facebook</a></li>
        <li><a href="#" className="text-blue-600">Twitter</a></li>
        <li><a href="#" className="text-blue-600">LinkedIn</a></li>
      </ul>
      </div>
    </div>
  );
};

export default ContactUs;
