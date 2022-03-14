import { useEffect, useState } from 'react';

const Distribution = (props) => {
  const { handleChange, value, rank, showDelete } = props;
  const [edit, setEdit] = useState(false);

  const [percent, setPercent] = useState(value);

  const colorProvider = (val) => {
    switch (val) {
      case 1:
        return 'bg-indigo-yellow bg-opacity-20';
      case 2:
        return 'bg-red-pastel bg-opacity-20';
      case 3:
        return 'bg-indigo-gray bg-opacity-20';
      default:
        return 'bg-indigo-lightgray bg-opacity-5';
    }
  };

  const saveChanges = () => {
    let tempValue = parseInt(percent);
    if (Number.isNaN(tempValue) || tempValue < 0) {
      setEdit(!edit);
      setPercent(value);
    } else {
      handleChange('update', rank, tempValue)
    }
  };

  useEffect(() => {
    setPercent(value);
  }, [value]);

  return (
    <div className={`flex items-center p-2 ${colorProvider(rank)} bg-opacity-20 rounded-lg mb-5`}>
      <p className="p-5 w-1/3 mr-10">Rank {rank}</p>
      {edit ? (
        <input
          className="p-1 px-3 w-1/3 bg-none rounded-lg"
          type="number"
          onChange={(e) => setPercent(e.target.value)}
          value={percent}
        />
      ) : (
        <div className="p-3 w-1/3 flex items-center justify-between">
          <p className="mr-10">{value} %</p>
        </div>
      )}
      <div className="p-5 w-1/3 flex items-center">
        {edit ? (
          <>
            <button
              className="w-32 mr-5 py-2 bg-indigo-green text-indigo-white"
              onClick={() => {
                saveChanges();
                setEdit(!edit);
              }}
            >
              Save
            </button>
            <button
              className="w-32 py-2 bg-red-pastel text-indigo-white"
              onClick={() => {
                setEdit(!edit);
                setPercent(value);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="w-32 py-2 bg-indigo-buttonblue mr-5 text-indigo-white"
              onClick={() => setEdit(!edit)}
            >
              Edit
            </button>
            {showDelete && (
              <button
                className="w-32 py-2 bg-indigo-lightgray text-indigo-white"
                onClick={() => handleChange('delete', rank)}
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Distribution;
