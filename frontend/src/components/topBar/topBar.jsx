import './topBar.scss';

const TopBar = () => {

  return (
    <div className="dashboard__header">
      <div className="dashboard__header-left">
        {/* Left side content if needed later */}
      </div>
      <div className="dashboard__header-right">
        <div className="dashboard__user-info">
          <span className="user-name">Guest</span>
          <div className="dashboard__profile">
            <img 
              src="default-avatar-url.jpg" 
              alt="Profile Picture" 
              className="dashboard__profile-pic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
