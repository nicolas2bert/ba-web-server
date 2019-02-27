import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { login } from './actions';
import Photos from './Photos';
// import Loading from './utils/Loading';

class HomePresentational extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
        };
    }

    componentDidMount() {
        this.props.dispatch(login())
            .then(() =>
                this.setState({
                    logged: true,
                }));
    }
    render() {
        const { logged } = this.state;
        if (!logged) {
            return null;
        }
        return (
            <div>
                <Photos />
            </div>
        );
    }
}

HomePresentational.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    // forecastWeather: state.forecastWeather,
});

// const mapDispatchToProps = dispatch => ({
//     listPhotos: () => dispatch(listPhotos()),
// });

// const Home = connect(mapStateToProps, mapDispatchToProps)(HomePresentational);
const Home = connect(mapStateToProps)(HomePresentational);

export default Home;
