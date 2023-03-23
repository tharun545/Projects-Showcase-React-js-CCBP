import './index.css'

const Projects = props => {
  const {projectList} = props
  const {name, imageUrl} = projectList

  return (
    <li>
      <div className="project-card">
        <img src={imageUrl} alt={name} />
        <p>{name}</p>
      </div>
    </li>
  )
}

export default Projects
