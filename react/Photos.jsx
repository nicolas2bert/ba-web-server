import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { showPhoto, clearIntervals } from './actions';
// import Loading from './utils/Loading';

class PhotosPresentational extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        this.props.dispatch(showPhoto());
    }

    componentWillUnmount() {
        this.props.dispatch(clearIntervals());
    }
    render() {
        const { photo } = this.props;
        if (!photo.photoShown) {
            return null;
        }
        const { photoShown } = photo;
        return (
            <div> {
                <Row>
                    <Col xs="8" sm="8" md="8" lg="8" className="background-black crop">
                        <img className="image-center" src={photoShown.url} alt={photoShown.description} />
                    </Col>
                    <Col xs="4" sm="4" md="4" lg="4"> <div> {photoShown.description} </div> </Col>
                </Row>
            }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    photo: state.photo,
});

PhotosPresentational.propTypes = {
    dispatch: PropTypes.func.isRequired,
    photo: PropTypes.instanceOf(Object).isRequired,
};

// const mapDispatchToProps = dispatch => ({
//     listPhotos: () => dispatch(listPhotos()),
// });

// const Home = connect(mapStateToProps, mapDispatchToProps)(HomePresentational);
const Photos = connect(mapStateToProps)(PhotosPresentational);

export default Photos;
