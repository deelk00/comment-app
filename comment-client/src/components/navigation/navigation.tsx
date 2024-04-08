import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSearchTerm } from "../../hooks/use-search-term";

export const Navigation: React.FC = () => {
    const {searchTerm, setSearchTerm} = useSearchTerm();
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    }
    return (
        <nav className='navigation keep row'>
            <a href='/' className='brand icon keep c-pointer'>Commenter</a>
            <div className='row control'>
            <FontAwesomeIcon 
                className='keep icon' 
                size='lg'
                icon={"search"} 
                />
            <input 
                role='search' 
                type='text'
                className='search'
                onChange={handleSearchChange}
                value={searchTerm}
                />
            </div>
      </nav>
    )
}