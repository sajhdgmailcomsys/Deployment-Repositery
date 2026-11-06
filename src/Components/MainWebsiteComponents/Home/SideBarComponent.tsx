import React, { useRef, useEffect } from 'react';
import styles from './SideBarComponent.module.css';
import { getStoredAccessTokenData } from '../../../HelperFunctions/TokenFunctions';
import { useNavigate } from 'react-router-dom';

interface propsType{
  isExpanded:boolean;
  setIsExpanded:(value:boolean)=>void;

}

function Sidebar (props:propsType):React.JSX.Element {
  const sidebarRef = useRef<HTMLDivElement>(null);
    const user = getStoredAccessTokenData();
    
    const { isExpanded, setIsExpanded } = props;
    const navigate= useNavigate();
    
  
    const avatarLetter = user?.email?.[0]?.toUpperCase() || 'U';
    
    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
            
      if (
        target.closest('.global-toggle-btn') || 
        target.closest('.global-sidebar-container')
      ) {
        return; 
      }

      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded,setIsExpanded]);



    

  return (
    <aside
      ref={sidebarRef}
      className={` global-sidebar-container ${styles.sidebar} ${props.isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div className={styles.sidebardiv}>
         
        
        
      
      {
        props.isExpanded? (
            <div className={styles.sidebarcontent}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>{avatarLetter}</div>
                </div>
                <div className={styles.accountoptions}>
                    <button onClick={()=>navigate("/orderhistory")}>Order History</button>
                    
                    
                </div>

            </div>
        ): ""
      }
  </div>
    </aside>
  );
};

export default Sidebar;