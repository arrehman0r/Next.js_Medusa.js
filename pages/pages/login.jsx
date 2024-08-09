import { useRouter } from 'next/navigation';
import React, { useRef, useCallback, useMemo } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { toast } from 'react-toastify';
import ALink from '~/components/features/custom-link';
import { loginUser, registerUser } from '~/server/axiosApi';
import { userActions } from '~/store/user';
import { utilsActions } from '~/store/utils';

function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const customerDetailsRef = useRef({
        name: "",
        email: "",
        password: ""
    });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        customerDetailsRef.current[name] = value;
    }, []);
console.log("logini")
    const handleRegisterUser = useCallback(async (e) => {
        e.preventDefault();
        const { email, password, name } = customerDetailsRef.current;
        if (email && password) {
            dispatch(utilsActions.setLoading(true));
            try {
                const res = await registerUser({ email, password, first_name: name });
                dispatch(userActions.setUser(res?.customer));
                router.push("/");
                toast.success("Registration success");
            } catch (error) {
                console.log("error registering user", error);
                toast.error("Some error occurred");
            } finally {
                dispatch(utilsActions.setLoading(false));
            }
        }
    }, [dispatch, router]);

    const handleLoginUser = useCallback(async (e) => {
        e.preventDefault();
        const { email, password } = customerDetailsRef.current;
        if (email && password) {
            dispatch(utilsActions.setLoading(true));
            try {
                const res = await loginUser({ email, password });
                if (res && res.customer) {
                    dispatch(userActions.setUser(res.customer));
                    toast.success("Login success");
                    router.push("/");
                } else {
                    throw new Error("Invalid login response");
                }
            } catch (error) {
                console.log("Error in login:", error);
                toast.error("Some error occurred");
            } finally {
                dispatch(utilsActions.setLoading(false));
            }
        }
    }, [dispatch, router]);

    const renderLoginForm = useMemo(() => (
        <form onSubmit={handleLoginUser}>
            <div className="form-group mb-3">
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Username or Email Address *"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password *"
                    name="password"
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="form-choice text-center">
                                                <label className="ls-m">or Login With</label>
                                                <div className="social-links">
                                                    <ALink href="#" className="social-link social-google fab fa-google border-no"></ALink>
                                                    <ALink href="#" className="social-link social-facebook fab fa-facebook-f border-no"></ALink>
                                                    <ALink href="#" className="social-link social-twitter fab fa-twitter border-no"></ALink>
                                                </div>
                                            </div>
          
          
            <button className="btn btn-dark btn-block btn-rounded" type="submit">Login</button>
        </form>
    ), [handleLoginUser, handleInputChange]);

    const renderRegisterForm = useMemo(() => (
        <form onSubmit={handleRegisterUser}>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Your Name *"
                    onChange={handleInputChange}
                    required
                />
            </div>
            <h1 className="d-none">Party Shope Web Store - Login</h1>
            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li><ALink href="/shop">Party Shop</ALink></li>
                        <li>My Account</li>
                    </ul>
                </div>
            </nav>
            <button className="btn btn-dark btn-block btn-rounded" type="submit">Register</button>
        </form>
    ), [handleRegisterUser, handleInputChange]);

    return (
        <main className="main">
            <Helmet>
                <title>Party Shope Web Store | Login</title>
            </Helmet>
            {/* Rest of the component structure */}
            <div className="page-content mt-6 pb-2 mb-10">
                <div className="container">
                    <div className="login-popup">
                        <div className="form-box">
                            <div className="tab tab-nav-simple tab-nav-boxed form-tab">
                                <Tabs selectedTabClassName="active" selectedTabPanelClassName="active">
                                    <TabList className="nav nav-tabs nav-fill align-items-center border-no justify-content-center mb-5">
                                        <Tab className="nav-item">
                                            <span className="nav-link border-no lh-1 ls-normal">Sign in</span>
                                        </Tab>
                                        <li className="delimiter">or</li>
                                        <Tab className="nav-item">
                                            <span className="nav-link border-no lh-1 ls-normal">Register</span>
                                        </Tab>
                                    </TabList>

                                    <div className="tab-content">
                                        <TabPanel className="tab-pane">
                                            {renderLoginForm}
                                        </TabPanel>
                                        <TabPanel className="tab-pane">
                                            {renderRegisterForm}
                                        </TabPanel>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default React.memo(Login);