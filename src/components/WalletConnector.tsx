

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
      display: 'block',
      margin: '0 auto',
      fontSize: '24px',
      padding: '20px 40px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
      overflow: 'hidden',
      '&:hover': {
        '&::before': {
          left: '-10%',
        },
      },
    },
    shine: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '120%',
      height: '100%',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))',
      transition: 'all 0.3s'
    },
  });

export default function() {
    const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const handleClick = (msg:any, sev:any) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
}


    const { address, isConnecting, isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected) {
         handleClick(`Connected to wallet. Address : ${address}!`, 'success');
        }
        else {
            handleClick(`Disconnected from wallet!`, 'error');
        }

    }, [isConnected])

    function handleNavigate(route: string) {
        if (isConnected) {
            navigate(route);
            return;
        }

        handleClick(`Connect to your wallet to enter the NFT Marketplace`, 'warning');
    }


return(
        <div>
        <Snackbar open={open}    autoHideDuration={3000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Button 
      variant="contained" 
      onClick={() => handleNavigate('/landing')} 
      className={`${classes.root} ${severity === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      {severity === 'success' ? 'ENTER THE NFT MARKETPLACE!' : 'CONNECT YOUR WALLET TO CONTINUE'}
      <span className={classes.shine}></span>
    </Button>
</div>
    ) 

}
