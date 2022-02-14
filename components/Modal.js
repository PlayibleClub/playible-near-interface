import React from "react"

export default function Modal({closeModal}){
    return(
        <div class="overflow-y-auto overflow-x-hidden fixed top-1/4 z-50 justify-center items-center inset-0">
            <div className="relative px-96 w-full max-w h-full">
                    <div class="relative bg-indigo-white rounded-lg shadow border-2 border-indigo-default">
                        <div class="p-6 pt-0 text-center">
                            <svg class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                            <button data-modal-toggle="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={() => closeModal(false)}>
                                Yes, I'm sure
                            </button>
                            <button data-modal-toggle="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600" onClick={() => closeModal(false)}>No, cancel</button>
                        </div>
                    </div>
            </div>
        </div>
    )
}