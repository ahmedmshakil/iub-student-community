
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';
import { UNIVERSITY_NAME, UNIVERSITY_SHORT_NAME, STUDENT_EMAIL_DOMAIN } from '../constants';

const LoginPage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Added for mock login
  const [password, setPassword] = useState(''); // Password field for UI, not used in mock logic
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith(`@${STUDENT_EMAIL_DOMAIN}`)){
      alert(`Email must be a valid ${UNIVERSITY_SHORT_NAME} student email (ends with @${STUDENT_EMAIL_DOMAIN})`);
      return;
    }
    if (!password) {
      alert("Password is required.");
      return;
    }
    if (!studentId) {
      alert("Student ID is required.");
      return;
    }
     if (!name) {
      alert("Your Name is required.");
      return;
    }
    await login(studentId, email, name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-iub-green to-green-700 p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <div className="text-center mb-8">
          <img src={`https://picsum.photos/seed/${UNIVERSITY_SHORT_NAME}/100/100`} alt={`${UNIVERSITY_SHORT_NAME} Logo`} className="w-20 h-20 mx-auto mb-4 rounded-full object-cover" />
          <h1 className="text-3xl font-bold text-iub-primary">{UNIVERSITY_SHORT_NAME} Community</h1>
          <p className="text-gray-600 mt-1">{UNIVERSITY_NAME}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
          <Input
            label="Student ID"
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g., 2010XXX"
            required
          />
          <Input
            label="Student Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`your_id@${STUDENT_EMAIL_DOMAIN}`}
            required
          />
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" color="text-white" /> : 'Login'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="#" className="font-medium text-iub-primary hover:text-iub-primary/80">Contact Admin</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
