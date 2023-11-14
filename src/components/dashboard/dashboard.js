import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.scss';
import { BASE_URL } from '../../utils/api';
import professionInterests from '../../utils/professions';

const Dashboard = ({ onLogOut }) => {
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
	const [successMessage, setSuccessMessage] = useState('');
	const [userName, setUserName] = useState('Loading...');
	const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [bio, setBio] = useState('');

	useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/${localStorage.getItem('userId')}`,
          {
            headers: {
              Authorization: `${localStorage.getItem('userToken')}`,
            },
          }
        );

        const userData = response.data;
        setSelectedProfession(userData.profession);
        setSelectedInterests(userData.interests || []);
				setUserName(userData.username.toUpperCase());
        setBio(userData.bio || '');
				console.log(userData);
      } catch (error) {
        setError('Error fetching user data. Please try again.');
        console.error(error);
      }
    };

    fetchData(); // Call the function to fetch data when the component mounts
  }, []);

  const handleProfessionChange = (e) => {
    const profession = e.target.value;
    setSelectedProfession(profession);
    setSelectedInterests([]);
  };

  const handleInterestChange = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSave = async () => {
    try {
			setSaving(true);
      const response = await axios.put(
        `${BASE_URL}/users/${localStorage.getItem('userId')}`,
        {
          profession: selectedProfession,
          interests: selectedInterests,
          bio,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem('userToken')}`,
          },
        }
      );
      console.log(response);
			setSuccessMessage('\u2713 Data saved successfully');
			setTimeout(() => {
				setSuccessMessage('');
			}, 2980);

    } catch (error) {
      setError('Error saving data. Please try again.');
      console.error(error);
    }finally{
			setSaving(false);
		}
  };

	const handleDeleteAccount = async () => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");

    if (confirmDelete) {
      try {
        // Send a request to delete the user's account
        await axios.delete(`${BASE_URL}/users/${localStorage.getItem('userId')}`, {
          headers: {
            Authorization: `${localStorage.getItem('userToken')}`,
          },
        });

        // Clear local storage and log the user out
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        onLogOut();
      } catch (error) {
        setError('Error deleting account. Please try again.');
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    // clear local storage and redirect to the login page
    localStorage.removeItem('userToken');
		localStorage.removeItem('userId');
		onLogOut();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{userName}</h2>
        <div className="user-info-container">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
					<button onClick={handleDeleteAccount} className="logout-button">
						Delete Account
					</button>
        </div>
      </div>
      <div>
        <label>Choose Your Profession:</label>
        <select
          value={selectedProfession}
          onChange={handleProfessionChange}
          className="dashboard-select"
        >
          <option value="" disabled>
            Select a Profession
          </option>
          {Object.keys(professionInterests).map((profession) => (
            <option key={profession} value={profession}>
              {profession}
            </option>
          ))}
        </select>
      </div>
      {selectedProfession && (
        <div>
          <label>Select Your Interests:</label>
          <div className="interests-container">
            {professionInterests[selectedProfession].map((interest) => (
              <label key={interest} className="interest-label">
                <input
                  type="checkbox"
                  value={interest}
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className="interest-checkbox"
                />
                {interest}
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <label>Write bio under 50 words:</label>
        <textarea
          value={bio}
          onChange={handleBioChange}
          className="dashboard-textarea"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
			{successMessage && <p className="success-animation-message">{successMessage}</p>}
      <button onClick={handleSave} className="save-button" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default Dashboard;
