var React = require('react');
var DefaultLayout = require('./default');

class ShowEachArtist extends React.Component {
  render() {

    const eachArtist = this.props.artist.map ((byArtist,index)=>{
        let editLink = `/artist/${byArtist.id}/edit`;
        let actionDelete = `/artist/${byArtist.id}?_method=DELETE`;
        return <div className="container-fluid" key = {index}>
                    <div className="row">
                        <div className="col">
                            <h1>Artist Name: {byArtist.name}</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <img src={byArtist.photo_url} alt="artist_photo" height="150" width="200"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <h3>Nationality: {byArtist.nationality}</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1">
                            <button type="button" className="btn btn-primary"><a href= {editLink}> edit </a></button>
                        </div>
                        <div className="col-1">
                            <form method="POST" action={actionDelete}>
                                    <button type="button" className="btn btn-danger"> delete </button>
                            </form>
                        </div>
                    </div>
               </div>
    })

    return (
        <DefaultLayout>
            {eachArtist}
        </DefaultLayout>
    );
  }
}

module.exports = ShowEachArtist;