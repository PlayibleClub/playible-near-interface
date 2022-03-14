import { useState } from 'react';
import Container from '../../../components/containers/Container';
import Input from '../../../components/Input';
import LoadingPageDark from '../../../components/loading/LoadingPageDark';
import Main from '../../../components/Main';
import Distribution from './components/distribution';

const Index = (props) => {
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState([
    {
      name: 'GAMES',
      isActive: true,
    },
    {
      name: 'CREATE',
      isActive: false,
    },
  ]);

  const [distribution, setDistribution] = useState([
    {
      rank: 1,
      percentage: 0,
    },
  ]);

  const changeTab = (name) => {
    const tabList = [...tabs];

    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    setTabs([...tabList]);
  };

  const modifyRankList = (type, rankNum, percentVal) => {
    let tempList = [...distribution]

    if (type === 'add') {
      const newDist = {
        rank: distribution.length + 1,
        percentage: 20
      }
      setDistribution([...distribution, newDist])
    }

    if (type === 'update') {
      tempList.forEach(item => {
        if (item.rank === rankNum) {
          item.percentage = percentVal
        }
      })

      setDistribution(tempList)
    }

    if (type === 'delete') {
      let newList = tempList.filter((item) => item.rank !== rankNum);

      setDistribution(newList);
    }
  }

  return (
    <Container isAdmin>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          {loading ? (
            <LoadingPageDark />
          ) : (
            <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-indigo-black">
              <div className="flex md:ml-4 font-bold ml-8 font-monument mt-5">
                {tabs.map(({ name, isActive }) => (
                  <div
                    className={`cursor-pointer mr-6 ${
                      isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                    }`}
                    onClick={() => changeTab(name)}
                  >
                    {name}
                  </div>
                ))}
              </div>
              <hr className="opacity-50" />
              <div className="p-8 px-32">
                <div className="flex">
                  {/* GAME TITLE */}
                  <div className="flex flex-col lg:w-1/2 lg:mr-10">
                    <label className="font-monument" htmlFor="title">
                      TITLE
                    </label>
                    <input
                      className="border outline-none rounded-lg px-3 p-2"
                      id="title"
                      placeholder="Enter title"
                    />
                  </div>

                  {/* DATE & TIME */}
                  <div className="flex flex-col lg:w-1/2">
                    <label className="font-monument" htmlFor="datetime">
                      DATE & TIME
                    </label>
                    <input
                      className="border outline-none rounded-lg px-3 p-2"
                      id="datetime"
                      type="datetime-local"
                    />
                  </div>
                </div>

                <div className="flex mt-8">
                  {/* DURATION */}
                  <div className="flex flex-col lg:w-1/2 lg:mr-10">
                    <label className="font-monument" htmlFor="duration">
                      DURATION
                    </label>
                    <input
                      className="border outline-none rounded-lg px-3 p-2"
                      id="duration"
                      placeholder="Express in minutes"
                    />
                  </div>

                  {/* PRIZE */}
                  <div className="flex flex-col lg:w-1/2">
                    <label className="font-monument" htmlFor="prize">
                      PRIZE
                    </label>
                    <input
                      className="border outline-none rounded-lg px-3 p-2"
                      id="prize"
                      type="number"
                      min={1}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                {/* DISTRIBUTION FORM */}
                <div className="mt-8">
                  <p className="font-monument">DISTRIBUTION</p>
                  {distribution.map(({ rank, percentage }) => (
                    <Distribution rank={rank} value={percentage} handleChange={modifyRankList} showDelete={rank === distribution.length && distribution.length > 1} />
                  ))}

                  <div className="flex justify-center p-2 bg-opacity-10 ">
                    <button
                      className="bg-indigo-buttonblue ml-7 text-indigo-white w-5/6 md:w-80 h-10 text-center font-bold text-sm mt-4"
                      onClick={() => modifyRankList('add')}
                    >
                      Add New Rank
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </Main>
      </div>
    </Container>
  );
};

export default Index;
