// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

///////////////
// Custom types
///////////////

enum ProjectState { OPEN, PROGRESS, COMPLETED, LITIGATION, ARBITRATION}

enum LitigationDecision { DEV, FUNDERS }

struct Fund {
    uint bounty;
    uint bail;
}

struct Project {
    uint id;
    string title;
    // IPFS URI of the project description
    string uri;
    address creator;
    uint creation_date;
    // if true, the project is open to fundings
    bool open_to_fundings;
    ProjectState state;
    uint total_bounty;
    uint total_bail;
    uint application_date;
    address chosen_dev;
    address arbitrator;
    address[] funders_addr;
    address[] developpers_addr;
    // list of funders who funded the project
    mapping(address => Fund) funders;
    // Mapping of developpers who applied to the project (false if the developper has removed his application)
    mapping(address => bool) applications;
    // vote of the funders to choose the developper
    mapping(address => address) application_votes;
}   

struct Project_view {
    uint id;
    string title;
    // IPFS URI of the project description
    string uri;
    address creator;
    uint creation_date;
    // if true, the project is open to fundings
    bool open_to_fundings;
    ProjectState state;
    uint total_bounty;
    uint total_bail;
    uint application_date;
    address chosen_dev;
    address arbitrator;
    address[] funders_addr;
    address[] developpers_addr;
}   

struct Developpers_attributes {
    // current reputation of the developper
    uint reputation;
    // IPFS URI of the developper's CV
    string cv_uri;
}
    

contract SourcerAO is AccessControl {
    
    ////////
    // Roles
    ////////

    // Admin can set project parameters
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    // Admin manager can grant and revoke admin role
    bytes32 public constant ADMIN_MANAGER_ROLE = keccak256("ADMIN_MANAGER_ROLE");
    // Allows to ban a developper from beeing arbitrator, even if he has the required reputation
    bytes32 public constant ARBITRATION_BAN = keccak256("ARBITRATION_BAN");

    
    /////////////
    // Attributes
    /////////////

    // Projet parameters
    uint bail_percentage;
    uint reputation_threshold_for_arbitration;
    uint litigation_period;
    uint end_project_vote_period;
    
    // mappings
    mapping (uint => Project) Projects;
    uint projects_length;
    mapping (address => Developpers_attributes) Developpers;


    /////////////////////////////////////////////////////////////
    // Functions
    /////////////////////////////////////////////////////////////

    constructor() {
        // set admin role to contract creator
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_MANAGER_ROLE, msg.sender);
        setProjectParameters(10, 1 ether, 1 days, 1 days);
        projects_length=0;
    }

    // set project parameters
    function setProjectParameters(uint _bail_percentage, uint _reputation_threshold_for_arbitration, uint _litigation_period, uint _end_project_vote_period) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        bail_percentage = _bail_percentage;
        reputation_threshold_for_arbitration = _reputation_threshold_for_arbitration;
        litigation_period = _litigation_period;
        end_project_vote_period = _end_project_vote_period;
    }

    // role management
    function isAdmin(address addr) public view returns (bool) {
        return hasRole(ADMIN_ROLE, addr);
    }
    function isAdminManager(address addr) public view returns (bool) {
        return hasRole(ADMIN_MANAGER_ROLE, addr);
    }
    function grantAdminRole(address _address) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin manager");
        grantRole(ADMIN_ROLE, _address);
    }
    function revokeAdminRole(address _address) public {
        require(hasRole(ADMIN_MANAGER_ROLE, msg.sender), "Caller is not an admin manager");
        revokeRole(ADMIN_ROLE, _address);
    }
    function grantAdminManagerRole(address _address) public {
        require(hasRole(ADMIN_MANAGER_ROLE, msg.sender), "Caller is not an admin manager");
        grantRole(ADMIN_MANAGER_ROLE, _address);
    }
    function revokeAdminManagerRole(address _address) public {
        require(hasRole(ADMIN_MANAGER_ROLE, msg.sender), "Caller is not an admin manager");
        revokeRole(ADMIN_MANAGER_ROLE, _address);
    }
    
    // project creation
    function createProject(string memory _title, string memory _uri, bool _open_to_fundings) public {
        uint id = projects_length;
        Project storage p = Projects[id];
        projects_length++;
        p.id = id;
        p.title = _title;
        p.uri = _uri;
        p.creator = msg.sender;
        p.creation_date = block.timestamp;
        p.open_to_fundings = _open_to_fundings;
        p.state = ProjectState.OPEN;
        p.total_bounty = 0;
        p.total_bail = 0;
        p.application_date = 0;
        p.chosen_dev = address(0);
        p.arbitrator = address(0);
    }

    // View project
    function getProjectCount() public view returns (uint) {
        return projects_length;
    }
    function getProject(uint id) public view returns (Project_view memory) {
        return Project_view(Projects[id].id, Projects[id].title, Projects[id].uri, Projects[id].creator, Projects[id].creation_date, Projects[id].open_to_fundings, Projects[id].state, Projects[id].total_bounty, Projects[id].total_bail, Projects[id].application_date, Projects[id].chosen_dev, Projects[id].arbitrator, Projects[id].funders_addr, Projects[id].developpers_addr);    
    }
}
