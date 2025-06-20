import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Verified = () => {
    const [params] = useSearchParams();
    const success = params.get("success");
    const error = params.get("error");
    const already = params.get("already");

    return (
        <Box textAlign="center" mt={10} p={4}>
            {success && (
                <>
                    <Typography variant="h4" color="success.main" gutterBottom>
                        ✅ Email Verified Successfully!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        You can now log in to your account.
                    </Typography>
                </>
            )}

            {already && (
                <>
                    <Typography variant="h4" color="warning.main" gutterBottom>
                        ⚠️ Email Already Verified
                    </Typography>
                    <Typography variant="body1">
                        You can log in with your credentials.
                    </Typography>
                </>
            )}

            {error && (
                <>
                    <Typography variant="h4" color="error.main" gutterBottom>
                        ❌ Verification Failed
                    </Typography>
                    <Typography variant="body1">
                        The verification link is invalid or has expired.
                    </Typography>
                </>
            )}

            <Button variant="contained" sx={{ mt: 4 }} component={Link} to="/login">
                Go to Login
            </Button>
        </Box>
    );
};

export default Verified;
