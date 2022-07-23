using API.DTOs;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper)
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            //Check if the email already exist and return a user friendly error response
            if(CheckEmailExisitsAsync(registerDTO.Email).Result.Value)
            {
                var errors = new [] {"The email address you entered already exists"};
                return new BadRequestObjectResult(new ApiValidationErrorResponse{Errors = errors});
            }

            // create a new app user object from the given information
            var user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.Email
            };

            //attempt to add the new user to the identity database
            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            /*  return a Bad Request error if the user enters a weak password
                or a pre-existing email/username */
            if(!result.Succeeded) return BadRequest(new ApiResponse(400));

            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            //Attempt to find the user with the given email
            var user = await _userManager.FindByEmailAsync(loginDTO.Email);
            if(user == null) return Unauthorized(new ApiResponse(401));

             //Attempt to find the user with the given password
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);
            if(!result.Succeeded) return Unauthorized(new ApiResponse(401));

            // If user enters correct email and password
            return new UserDTO
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentlyLoggedInUser()
        {   
           var user = await _userManager.FindUserByClaimsPrincipalAsync(User);

            return new UserDTO
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }
        
        
        /*  a helper method so the client can do asynchronous validation*/
        [HttpGet("emailExists")]
          public async Task<ActionResult<bool>> CheckEmailExisitsAsync([FromQuery] string email)
          {
            return await _userManager.FindByEmailAsync(email) != null;
          }
        
        [Authorize]
        [HttpGet("address")]
          public async Task<ActionResult<AddressDTO>> GetUserAddress()
          {
             var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(User);

             return _mapper.Map<Address, AddressDTO>(user.Address);
          }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDTO>> UpdateUserAddress(AddressDTO address)
        {
            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(User);
            user.Address = _mapper.Map<AddressDTO, Address>(address);

            // update the address in the identity database
            var result = await _userManager.UpdateAsync(user);

            if(result.Succeeded) return Ok(_mapper.Map<Address, AddressDTO>(user.Address));

            return BadRequest("There was a problem updating the user's address");
        }

    }

}