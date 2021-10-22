import React, { useEffect, useState } from 'react';
import DesktopNavbar from '../components/DesktopNavbar';
import DesktopHeaderBase from '../components/DesktopHeaderBase';
import TransactionModal from '../components/modals/TransactionModal';

const Container = (props) => {
  const { children } = props
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
		//screen setup
		const mediaWatcher = window.matchMedia("(max-width: 500px)")

		function updateIsNarrowScreen(e) {
			setIsNarrowScreen(e.matches);
		}
		mediaWatcher.addEventListener('change', updateIsNarrowScreen)

		return function cleanup() {
		mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
		}
	}, [])

  return (
    <div className="font-montserrat h-screen relative bg-indigo-dark">
      {
        isNarrowScreen ? (
          <DesktopNavbar/>
        ) : (
          <div className="flex bg-indigo-dark">
            <DesktopNavbar/>
            <div className="flex flex-col w-full h-full overflow-y-hidden overflow-x-hidden">
              <DesktopHeaderBase/>
              {children}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Container;
