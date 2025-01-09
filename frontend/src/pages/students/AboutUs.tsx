import React from 'react';

const AboutUs:React.FC = () => {
  return (
    <div className='w-full '>
    <div className="container max-w-7xl place-self-center px-4 py-8">
    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">About Us</h1>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        Welcome to <strong>LearnLab</strong>, where we redefine the way people learn, teach, and grow. Our platform 
        serves as a bridge between knowledge seekers and passionate educators, creating a dynamic community of lifelong learners.
      </p>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        At <strong>LearnLab</strong>, our mission is to empower individuals by providing access to world-class education 
        and opportunities for personal and professional development. We believe that learning should be accessible, 
        engaging, and tailored to individual needs.
      </p>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Vision</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        We envision a world where knowledge knows no boundaries and everyone has the tools to unlock their full potential. 
        By leveraging technology, we aim to create an inclusive ecosystem where students thrive, instructors excel, 
        and learning never stops.
      </p>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Why Choose Us?</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-4 mb-8">
        <li>
          <strong>Personalized Learning:</strong> Courses designed to cater to a variety of learning styles and levels.
        </li>
        <li>
          <strong>Experienced Instructors:</strong> A curated community of passionate and qualified educators.
        </li>
        <li>
          <strong>Seamless Interaction:</strong> Real-time chat, forums, and collaborative tools for better engagement.
        </li>
        <li>
          <strong>Secure Platform:</strong> Data privacy and security are at the core of our values.
        </li>
      </ul>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Story</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        <strong>LearnLab</strong> was founded in [Year] with the goal of transforming education through innovation. 
        Starting as a small initiative, we’ve grown into a trusted platform for learners and educators worldwide. 
        Our journey has been fueled by the stories of success and growth shared by our users.
      </p>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Core Values</h2>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-4 mb-8">
        <li>
          <strong>Excellence:</strong> We strive for quality in everything we do.
        </li>
        <li>
          <strong>Innovation:</strong> Embracing change and finding new ways to solve challenges.
        </li>
        <li>
          <strong>Inclusivity:</strong> Creating a welcoming environment for everyone.
        </li>
        <li>
          <strong>Integrity:</strong> Upholding honesty and transparency in all our actions.
        </li>
      </ul>

      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Join Our Community</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        Whether you’re a student eager to learn, an instructor ready to inspire, or an admin striving for excellence, 
        <strong>LearnLab</strong> is the place for you. Together, let’s shape the future of education and make 
        knowledge a resource for all.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Thank you for choosing <strong>LearnLab</strong>. Let’s build a better tomorrow, one lesson at a time.
      </p>
      </div>
    </div>
  );
};

export default AboutUs;
