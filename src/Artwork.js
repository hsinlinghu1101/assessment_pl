import './Artwork.css';

export default function Artwork(props){
  return(
    <div className='artwork'>
        <p><b>Artwork title: </b>{props.data.title}</p>
        <a href={props.data.primaryImage} target="_blank" rel="noreferrer">
        <img src={props.data.primaryImageSmall} alt={props.data.title}/>
        </a>
        <p><b>Artist name:</b> {props.data.artistDisplayName}</p>
        <p><b>Department:</b>Department: {props.data.department}</p>
    </div>
  )
}