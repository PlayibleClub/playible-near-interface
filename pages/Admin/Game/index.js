import { useState } from 'react';
import Container from '../../../components/containers/Container';
import Input from '../../../components/Input';
import LoadingPageDark from '../../../components/loading/LoadingPageDark';
import Main from '../../../components/Main';

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
              <div className="p-8">
                <div className="flex flex-col">
                  <label className="font-monument" htmlFor="game-title">
                    Title
                  </label>
                  <input className="border outline-none rounded-lg px-3 p-2" id="game-title" />
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
