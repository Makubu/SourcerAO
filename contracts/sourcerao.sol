// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

///////////////
// Custom types
///////////////

enum ProjectState { OPEN, VOTE_PHASE, WAITING_FOR_DEV, PROGRESS, COMPLETED, LITIGATION, ARBITRATION, CLOSED}
// OPEN: the project is open to fundings and applications
// VOTE_PHASE: the project is closed to fundings and applications, the funders are voting to choose the developper
// WAITING_FOR_DEV: the project is waiting for the developper to accept the project and put a bail
// PROGRESS: the project is in progress, the developper has been chosen
// COMPLETED: the project is completed but litigation is still possible
// LITIGATION: the project is in litigation
// ARBITRATION: the project is in arbitration
// CLOSED: the project is closed, nothing can be done anymore

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
    // date of the end of the application phase
    uint application_deadline;
    // dat of the end of the vote phase
    uint vote_deadline;
    address chosen_dev;
    address arbitrator;
    address[] funders_addr;
    address[] developpers_addr;
    // date of the project delivery
    uint completion_date;
    // list of funders who funded the project
    mapping(address => Fund) funds;
    // Mapping of developpers who applied to the project (false if the developper has removed his application)
    mapping(address => bool) applications;
    // vote of the funders to choose the developper
    mapping(address => address) funder_votes;
    // value given to each developper by the funders in the vote phase
    mapping(address => uint) application_votes;
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
    // date of the end of the application phase
    uint application_deadline;
    // dat of the end of the vote phase
    uint vote_deadline;
    address chosen_dev;
    address arbitrator;
    address[] funders_addr;
    address[] developpers_addr;
    uint completion_date;
}   

struct Developpers_attributes {
    // current reputation of the developper
    uint reputation;
    // IPFS URI of the developper's CV
    string cv_uri;
}
    

contract SourcerAO is AccessControl {

    // event emitted when a developper is chosen for a project
    event dev_chosen(uint id, address dev);
    
    /////////////////////////////////////////////////////////////
    // Roles
    /////////////////////////////////////////////////////////////

    // Admin can set project parameters
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    // Admin manager can grant and revoke admin role
    bytes32 public constant ADMIN_MANAGER_ROLE = keccak256("ADMIN_MANAGER_ROLE");
    // Allows to ban a developper from beeing arbitrator, even if he has the required reputation
    bytes32 public constant ARBITRATION_BAN = keccak256("ARBITRATION_BAN");

    
    /////////////////////////////////////////////////////////////
    // Attributes
    /////////////////////////////////////////////////////////////

    // Projet parameters
    uint public bail_percentage;
    uint public reputation_threshold_for_arbitration;
    uint public litigation_period;
    
    //// mappings ////
    mapping (uint => Project) Projects;
    uint projects_count;
    // List of developpers with their attributes
    mapping (address => Developpers_attributes) Developpers;


    /////////////////////////////////////////////////////////////
    // Functions      
    /////////////////////////////////////////////////////////////

    constructor() {
        // set admin role to contract creator
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_MANAGER_ROLE, msg.sender);
        setParameters(10, 1 ether, 1 days);
        projects_count=0;
    }

    // set contract parameters
    function setParameters(uint _bail_percentage, uint _reputation_threshold_for_arbitration, uint _litigation_period) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        // the percentage of the funds that will be used as a bail
        bail_percentage = _bail_percentage;
        // the reputation threshold to be arbitrator
        reputation_threshold_for_arbitration = _reputation_threshold_for_arbitration;
        // the period in which the funders can start the litigation phase after the end of the project
        litigation_period = _litigation_period;
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
    
       
    
    //// Views ////
    // get parameters
    function getParameters() public view returns (uint, uint, uint) {
        return (bail_percentage, reputation_threshold_for_arbitration, litigation_period);
    }
    function getProjectCount() public view returns (uint) {
        return projects_count;
    }
    function getProject(uint id) public view returns (Project_view memory) {
        return Project_view(Projects[id].id, Projects[id].title, Projects[id].uri, Projects[id].creator, Projects[id].creation_date, Projects[id].open_to_fundings, Projects[id].state, Projects[id].total_bounty, Projects[id].total_bail, Projects[id].application_deadline, Projects[id].vote_deadline, Projects[id].chosen_dev, Projects[id].arbitrator, Projects[id].funders_addr, Projects[id].developpers_addr, Projects[id].completion_date);    
    }
    // For the given project_id "id", return the address of the developper that "addr" voted for 
    function getVote(uint id, address addr) public view returns (address) {
        return Projects[id].funder_votes[addr];
    }
    // For the given project_id "id", return the funds associated to the address "addr"
    function getFunds(uint id, address addr) public view returns (uint, uint) {
        return (Projects[id].funds[addr].bounty, Projects[id].funds[addr].bail);
    }
    // hasApplied returns true if the developper has applied to the project
    function hasApplied(uint id, address addr) public view returns (bool) {
        return Projects[id].applications[addr];
    }
    // getDevelopper returns the developper's attributes
    function getDevelopperDesc(address addr) public view returns (Developpers_attributes memory) {
        return Developpers[addr];
    }

    // project creation
    function createProject(string memory _title, string memory _uri, bool _open_to_fundings) public {
        uint id = projects_count;
        Project storage p = Projects[id];
        projects_count++;
        p.id = id;
        p.title = _title;
        p.uri = _uri;
        p.creator = msg.sender;
        p.creation_date = block.timestamp;
        p.open_to_fundings = _open_to_fundings;
        p.state = ProjectState.OPEN;
        p.total_bounty = 0;
        p.total_bail = 0;
        p.application_deadline = 0;
        p.vote_deadline = 0;
        p.chosen_dev = address(0);
        p.arbitrator = address(0);
    }

    // set project parameters
    function setProjectParameters(uint id, uint _application_deadline, uint _vote_deadline) public {
        require(Projects[id].creator == msg.sender, "Caller is not the project creator");
        Projects[id].application_deadline = _application_deadline;
        Projects[id].vote_deadline = _vote_deadline;
    }
    
    // Fund a project      
    function fundProject(uint id) public payable {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].open_to_fundings, "Project is not open to fundings");
        require(Projects[id].state == ProjectState.OPEN, "Project is not open");
        if (Projects[id].funds[msg.sender].bounty == 0) {
            Projects[id].funders_addr.push(msg.sender);
        }
        Projects[id].funder_votes[msg.sender] = address(0);
        uint _bail = (msg.value * bail_percentage) / 100;
        uint _bounty = msg.value - _bail; 
        Projects[id].funds[msg.sender].bounty += _bounty;
        Projects[id].funds[msg.sender].bail += _bail;
        Projects[id].total_bounty += _bounty;
        Projects[id].total_bail += _bail;
    }

    // Withdraw funds from a project
    function withdrawFunds(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.OPEN, "Project is not open");
        require(Projects[id].funds[msg.sender].bounty > 0, "You have no funds to withdraw");
        uint _bounty = Projects[id].funds[msg.sender].bounty;
        uint _bail = Projects[id].funds[msg.sender].bail;
        Projects[id].funds[msg.sender].bounty = 0;
        Projects[id].funds[msg.sender].bail = 0;
        Projects[id].total_bounty -= _bounty;
        Projects[id].total_bail -= _bail;
        payable(msg.sender).transfer(_bounty + _bail);
    }

    // Apply to a project
    function applyToProject(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.OPEN, "Project is not open");
        require(Projects[id].applications[msg.sender] == false, "You have already applied to this project");
        Projects[id].applications[msg.sender] = true;
        Projects[id].developpers_addr.push(msg.sender);
    }

    // Update developper's CV
    function updateCV(string memory _cv_uri) public {
        Developpers[msg.sender].cv_uri = _cv_uri;
    }
    // Remove developper's application
    function removeApplication(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.OPEN, "Project is not open to externak fundings");
        require(Projects[id].application_deadline > block.timestamp, "Application deadline is passed");
        require(Projects[id].applications[msg.sender] == true, "You have not applied to this project");
        Projects[id].applications[msg.sender] = false;
    }

    // Start the vote phase
    function startVotePhase(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].application_deadline < block.timestamp, "Application deadline is not passed");
        require(Projects[id].state == ProjectState.OPEN, "Project is not open");
        require(Projects[id].applications[msg.sender] == false, "You have applied to this project");
        Projects[id].state = ProjectState.VOTE_PHASE;
    }

    // Force vote phase, only the creator can do this to force the vote phase to start, even if the application deadline is not passed
    function forceVotePhase(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].creator == msg.sender, "You are not the creator of this project");
        require(Projects[id].state == ProjectState.OPEN, "Project is not open");
        require(Projects[id].applications[msg.sender] == false, "You have applied to this project");
        Projects[id].state = ProjectState.VOTE_PHASE;
    }
    
    // Vote for a developper
    function voteForDeveloper(uint id, address developper) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].vote_deadline > block.timestamp, "Vote phase is over");
        require(Projects[id].state == ProjectState.VOTE_PHASE, "Project is not in vote phase");
        require(Projects[id].applications[developper] == true, "Developper has not applied to this project");
        require(Projects[id].funds[msg.sender].bounty > 0, "You have no funds to vote");
        require(Projects[id].funder_votes[msg.sender] == address(0), "You have already voted");
        Projects[id].funder_votes[msg.sender] = developper;
        Projects[id].application_votes[developper] += Projects[id].funds[msg.sender].bounty;
    }

    // End the vote phase
    function endVotePhase(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.VOTE_PHASE, "Project is not in vote phase");
        require(Projects[id].vote_deadline < block.timestamp, "Vote phase is not over");
        Projects[id].state = ProjectState.WAITING_FOR_DEV;
        Projects[id].chosen_dev = getWinner(id);
        emit dev_chosen(id, Projects[id].chosen_dev);
    }

    // Get the developper with the most votes
    function getWinner(uint id) public view returns (address) {
        uint max = 0;
        address winner;
        for (uint i=0; i<Projects[id].developpers_addr.length; i++) {
            if (Projects[id].application_votes[Projects[id].developpers_addr[i]] > max) {
                max = Projects[id].application_votes[Projects[id].developpers_addr[i]];
                winner = Projects[id].developpers_addr[i];
            }
        }
        return winner;
    }

    // Accept the project
    function acceptProject(uint id) public payable {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.WAITING_FOR_DEV, "Project is not waiting for developper");
        require(Projects[id].chosen_dev == msg.sender, "You are not the chosen developper");
        require(msg.value == Projects[id].total_bail, "You must put the exact same bail as requested");
        Projects[id].state = ProjectState.PROGRESS;
        Projects[id].total_bail += msg.value;
    }

    // Renounce to be the developper of a project
    function renounceDevelopper(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.WAITING_FOR_DEV || Projects[id].state == ProjectState.PROGRESS, "Project is not in progress");
        require(Projects[id].chosen_dev == msg.sender, "You are not the chosen developper");
        Projects[id].chosen_dev = address(0);
        Projects[id].state = ProjectState.OPEN;
        for (uint i=0; i<Projects[id].funders_addr.length; i++) {
            Projects[id].funder_votes[Projects[id].funders_addr[i]] = address(0);
        }
        for (uint i=0; i<Projects[id].developpers_addr.length; i++) {
            Projects[id].application_votes[Projects[id].developpers_addr[i]] = 0;
        }
    }

    // Start the litigation phase from dev side
    function startLitigationPhase_dev(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.PROGRESS, "Project is not in progress");
        require(Projects[id].chosen_dev == msg.sender, "You are not the chosen developper");
        Projects[id].state = ProjectState.LITIGATION;
    }

    // Start the litigation phase from funder side
    function startLitigationPhase_funder(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.PROGRESS, "Project is not in progress");
        require(Projects[id].funds[msg.sender].bounty > 0, "You have not funded the project, can't start litigation");
        Projects[id].state = ProjectState.LITIGATION;
    }

    // Handle the litigation phase
    function handleLitigationPhase(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.LITIGATION, "Project is not in litigation");
        require(Projects[id].chosen_dev != msg.sender && Projects[id].funds[msg.sender].bounty == 0, "You can't handle the litigation phase if you are involved in the project");
        require(Projects[id].arbitrator == address(0), "Arbitrator is already set");
        require(Developpers[msg.sender].reputation >= reputation_threshold_for_arbitration, "You don't have the required reputation to be arbitrator");
        require(hasRole(ARBITRATION_BAN, msg.sender) == false, "You are banned from beeing arbitrator");
        Projects[id].arbitrator = msg.sender;
        Projects[id].state = ProjectState.ARBITRATION;
    }

    // Ban a developper from beeing arbitrator
    function banArbitrator(address addr) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        grantRole(ARBITRATION_BAN, addr);
    }

    // Remove a developper from the ban list
    function unbanArbitrator(address addr) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        revokeRole(ARBITRATION_BAN, addr);
    }

    // Settle the litigation
    // The decision is a number between 0 and 100, 100 means that the developper is right, 0 means that the funders are right
    // It will decide from who the arbitrator will take the bail and send the bounty to tARBITRATIONhe developper or back to the funders
    function settleLitigation(uint id, uint decision) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.ARBITRATION, "Project is not in arbitration");
        require(Projects[id].arbitrator == msg.sender, "You are not the arbitrator");
        require(decision >= 0 && decision <= 100, "Decision must be between 0 and 100");
        
        // transfer the bail to the arbitrator
        uint _bail = Projects[id].total_bail / 2;
        payable(msg.sender).transfer(_bail);

        // bail for dev
        uint _to_dev = _bail * decision / 100;

        // transfer to the funders
        for (uint i=0; i<Projects[id].funders_addr.length; i++) {
            address _funder = Projects[id].funders_addr[i];
            uint _bounty = Projects[id].funds[_funder].bounty;
            uint _bounty_dev = _bounty * decision / 100;
            _to_dev += _bounty_dev;
            // transfer to the funder (bounty + bail)
            payable(_funder).transfer(Projects[id].funds[_funder].bail*(100-decision)/100 +
                _bounty - _bounty_dev);
        }

        // transfer to the dev
        payable(Projects[id].chosen_dev).transfer(_to_dev);

        Projects[id].state = ProjectState.CLOSED;

    }

    // End the project in normal conditions
    // allow any funder to set the project as completed
    function completeProject(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.PROGRESS, "Project is not in progress");
        require(Projects[id].funds[msg.sender].bounty > 0, "You have not funded the project, can't complete the project");
        require(Projects[id].arbitrator == address(0), "Arbitrator is already set");
        Projects[id].completion_date = block.timestamp;
        Projects[id].state = ProjectState.COMPLETED;
    }

    // allow the developper to close the project and get paid
    function closeProject(uint id) public {
        require(projects_count > id, "Project does not exist");
        require(Projects[id].state == ProjectState.COMPLETED, "Project is not completed");
        require(Projects[id].chosen_dev == msg.sender, "You are not the chosen developper");
        require(block.timestamp > Projects[id].completion_date + litigation_period, "Litigation period is not over");
        Projects[id].state = ProjectState.COMPLETED;
        

        uint _bail = Projects[id].total_bail / 2;
        
        // transfer bounty + bail to the dev
        uint _to_dev = _bail + Projects[id].total_bounty;
        payable(Projects[id].chosen_dev).transfer(_to_dev);

        // transfer bail to the funders
        for (uint i=0; i<Projects[id].funders_addr.length; i++) {
            address _funder = Projects[id].funders_addr[i];
            // transfer to the funder (bounty + bail)
            payable(_funder).transfer(Projects[id].funds[_funder].bail);
        }

        Projects[id].state = ProjectState.CLOSED;

    }



}
