import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchData = () => {
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          'https://cc1db260-5795-4df5-a25b-8a994b57d974.mock.pstmn.io/assessment'
        );
        setData(response);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    questions: data.questions,
    answers: data.answers,
    loading,
  };
};

export default useFetchData;
