import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { DialogButton, Input, Button } from '../components';

const ConnectWallet = (props) => {
  const { onDispatch } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (data) => {
    onDispatch(data);
    // reset({ walletAddress: '' });
    setIsOpen(!isOpen);
  };

  return (
    <>
      <DialogButton
        isOpen={isOpen}
        title="Connect Terra Wallet"
        closeBtnTitle="Close"
        openBtnTitle="Connect Wallet"
        onOpen={() => setIsOpen(!isOpen)}
        onClose={() => setIsOpen(!isOpen)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <Input
              errors={errors.walletAddress}
              type="text"
              placeHolder="Enter Wallet Address"
              label="Wallet Address"
              {...register('walletAddress')}
            />
            <Button type="submit" onClick={(e) => e.preventDefault}>
              Connect Wallet
            </Button>
          </div>
        </form>
      </DialogButton>
    </>
  );
};

ConnectWallet.propTypes = {
  onDispatch: PropTypes.func.isRequired,
};

export default ConnectWallet;
