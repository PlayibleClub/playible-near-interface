import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';

const EntrySummaryModal = (props) => {
  const { title, children, visible, onClose = undefined } = props;

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 sm:p-0 sm:block mb-2 bg-fixed"
          onClose={() => onClose || console.log()}
        >
          <div className="min-h-screen px-4 text-center -mt-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Overlay className="fixed inset-0 bg-indigo-gray bg-opacity-60" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-indigo-white inline-block md:w-3/5 max-h-screen overflow-y-auto p-6 my-8 text-left align-middle transform shadow-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-4 font-monument uppercase"
                >
                  {title}
                  <div className="underlineBig" />
                </Dialog.Title>
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EntrySummaryModal;
