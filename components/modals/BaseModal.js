import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import underlineIcon from '../../public/images/blackunderline.png'

const BaseModal = (props) => {
  const { title, children, visible, onClose = null } = props

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto font-montserrat"
          onClose={() => {onClose ? onClose() : undefined}}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-indigo-black opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
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
              <div className="bg-indigo-white inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-2xl leading-6 text-gray-900 font-bold"
                >
                  {title}
                  <img src={underlineIcon} className="sm:object-none w-6 py-1" />
                </Dialog.Title>
                {children}
                <div className="mt-4">
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default BaseModal