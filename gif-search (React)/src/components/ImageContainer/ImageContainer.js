const ImageContainer = (props) => {
  const {
    imgUrl = "https://media.giphy.com/media/LmYoDjbWL0RkFcRoeb/giphy.gif",
    caption = "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
  } = props;
  return (
    <div className="image-container d-flex">
      <div className="image-inner">
        <img src={imgUrl} alt="" />
      </div>
      <div className="image-caption">
        <h3>{caption}</h3>
      </div>
    </div>
  );
};

export default ImageContainer;
