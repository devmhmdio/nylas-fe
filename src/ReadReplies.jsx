import React, { useEffect, useState } from 'react';
import { useNylas } from '@nylas/nylas-react';
import PropTypes from 'prop-types';

function ReadReplies() {
  const nylas = useNylas();
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [mailReplies, setMailReplies] = useState([]);

  useEffect(() => {
    if (!nylas) {
      return;
    }

    // Handle the code that is passed in the query params from Nylas after a successful login
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);

  useEffect(() => {
    const userIdString = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('userEmail');
    if (userIdString) {
      setUserId(userIdString);
    }
    if (userEmail) {
      setUserEmail(userEmail);
    }
  }, []);

  useEffect(() => {
    const getReplies = async () => {
      try {
        const url = SERVER_URI + '/nylas/read-replies';
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: userId,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setMailReplies(data);
        console.log('this is res', data);
      } catch (err) {}
    };

    if (userId) {
      getReplies();
    }
  }, [userId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Serial No.</th>
          <th>Replies</th>
        </tr>
      </thead>
      <tbody>
        {mailReplies.map((reply, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{reply}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ReadReplies.propTypes = {
  SERVER_URI: PropTypes.string,
};

export default ReadReplies;
