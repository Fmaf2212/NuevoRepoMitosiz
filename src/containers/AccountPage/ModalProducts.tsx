import React from 'react';
import Prices from "components/Prices";

interface ModalContentProps {
  selectedOrder: any; // Define el tipo de los datos de la orden
  handleCloseModal: () => void; // Define el tipo de la función para cerrar el modal
  totalPagesProducts: any; // Define el tipo de los datos de la orden
  renderPaginationButtonsProducts: () => JSX.Element[]; // Define el tipo de la función para cerrar el modal
}

const ModalContent: React.FC<ModalContentProps> = ({ selectedOrder, handleCloseModal, totalPagesProducts, renderPaginationButtonsProducts }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-2xl w-full">
          {selectedOrder && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Detalles de la orden:</h3>
              <div className='flex flex-col gap-4'>
              {selectedOrder.map((product: any, index: number) => (
                <div key={index} className="flex items-center py-4 sm:py-7 px-4 md:px-6 border border-gray-300 rounded-lg">
                  <div className="h-24 w-16 sm:w-20 flex-[.5] md:flex-none flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={`https://yosoymitosis.com/products/${product.imageName}`}
                      alt={product.productName}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className='mt-3 sm:mt-0 flex flex-col gap-5'>
                      <div className="flex flex-col items-end sm:flex-row justify-between">
                        <div>
                          <h3 className="text-base font-medium line-clamp-1">{product.productName}</h3>
                        </div>
                        <Prices price={product.subtotalNetAmount} className="mt-0.5 ml-2" />
                      </div>

                      <div className="flex flex-col-reverse items-end gap-2 justify-between md:flex-row">

                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500 dark:text-slate-400 flex items-center">
                            <span className="sm:inline-block"><strong>Cantidad:</strong> {product.quantity}</span>
                          </p>
                        </div>
                        <div className='flex flex-col'>
                          <span
                            className="font-medium text-indigo-600 dark:text-primary-500 "
                          >
                            <strong>Puntos Reales:</strong> {product.subtotalPoints} pts.
                          </span>
                          <span
                            className="font-medium text-indigo-600 dark:text-primary-500 "
                          >
                            <strong>Puntos de Red:</strong> {product.subtotalPointsNetwork} pts.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {totalPagesProducts > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  {renderPaginationButtonsProducts()}
                </div>
              )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalContent;
