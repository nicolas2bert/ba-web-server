import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPhoto, clearIntervals } from './actions';

const PhotosContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  position: fixed;
`;

const Image = styled.div`
  height: 80%;
  background-color: inherit;
`;

const ImageContent = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const Text = styled.div`
  height: 10%;
  background-color: #000;
  color: #FFF;
  text-align:center;
  font-family: 'Quicksand', sans-serif;
  display:flex;
`;

const Title = styled.div`
  font-size: 20px;
  margin:auto;
`;

const Description = styled.div`
`;

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
        console.log('photo.photoShown!!!', photo.photoShown);
        if (!photo.photoShown) {
            return null;
        }
        const { photoShown } = photo;
        return (
            <div> {
                <PhotosContainer>
                    <Text>
                        <Title> {photoShown.title} </Title>
                        <Description> {photoShown.description} </Description>
                    </Text>
                    <Image>
                        <ImageContent src={photoShown.url} alt={photoShown.description} />
                    </Image>
                </PhotosContainer>
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
